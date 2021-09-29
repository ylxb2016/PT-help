#include "znc/main.h"
#include "znc/User.h"
#include "znc/Nick.h"
#include "znc/Modules.h"
#include "znc/Chan.h"
#include "znc/IRCNetwork.h"

#include <string.h>
using std::pair;
using std::map;

#include <netinet/in.h>

#include <openssl/opensslv.h>
#include <openssl/blowfish.h>

#define REQUIRESSL	1

#if (OPENSSL_VERSION_NUMBER < 0x0090800f)
#error "We require openssl >= 0.9.8"
#endif

/*
    Public Base64 conversion tables
*/
unsigned char B64ABC[]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
unsigned char b64buf[256];


/*
    void initb64();
    Initializes the base64->base16 conversion tab.
    Call this function once when your program starts.
    and always after your B64 table has been changed.
*/
void initb64(){
    unsigned int i;
    for (i=0; i<256; i++) b64buf[i]=0x00;
    for (i=0; i<64; i++) b64buf[(B64ABC[i])]=i;
}

/*
   int b64toh(lpBase64String, lpDestinationBuffer);
   Converts base64 string b to hexnumber d.
   Returns size of hexnumber in bytes.
*/
int b64toh(char *b, char *d){
    int i,k,l;

    l=strlen(b);
    if (l<2) return 0;
    for (i=l-1;i>-1;i--){
        if (b64buf[(unsigned char)(b[i])]==0) l--;
        else break;
    }

    if (l<2) return 0;
    i=0, k=0;
    while (1) {
        i++;
        if (k+1<l) d[i-1]=((b64buf[(unsigned char)(b[k])])<<2);
        else break;
        k++;
        if (k<l) d[i-1]|=((b64buf[(unsigned char)(b[k])])>>4);
        else break;
        i++;
        if (k+1<l) d[i-1]=((b64buf[(unsigned char)(b[k])])<<4);
        else break;
        k++;
        if (k<l) d[i-1]|=((b64buf[(unsigned char)(b[k])])>>2);
        else break;
        i++;
        if (k+1<l) d[i-1]=((b64buf[(unsigned char)(b[k])])<<6);
        else break;
        k++;
        if (k<l) d[i-1]|=(b64buf[(unsigned char)(b[k])]);
        else break;
        k++;
    }
    return i-1;
}

/*
   int htob64(lpHexNumber, lpDestinationBuffer);
   Converts hexnumber h (with length l bytes) to base64 string d.
   Returns length of base64 string.
*/
int htob64(char *h, char *d, unsigned int l){
    unsigned int i,j,k;
    unsigned char m,t;

    if (!l) return 0;
    l<<=3;                              // no. bits
    m=0x80;
    for (i=0,j=0,k=0,t=0; i<l; i++){
        if (h[(i>>3)]&m) t|=1;
        j++;
        if (!(m>>=1)) m=0x80;
        if (!(j%6)) {
            d[k]=B64ABC[t];
            t&=0;
            k++;
        }
        t<<=1;
    }
    m=5-(j%6);
    t<<=m;
    if (m) {
        d[k]=B64ABC[t];
        k++;
    }
    d[k]&=0;
    return strlen(d);
}

unsigned char B64[]="./0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const char *prime1080="FBE1022E23D213E8ACFA9AE8B9DFADA3EA6B7AC7A7B7E95AB5EB2DF858921FEADE95E6AC7BE7DE6ADBAB8A783E7AF7A7FA6A2B7BEB1E72EAE2B72F9FA2BFB2A2EFBEFAC868BADB3E828FA8BADFADA3E4CC1BE7E8AFE85E9698A783EB68FA07A77AB6AD7BEB618ACF9CA2897EB28A6189EFA07AB99A8A7FA9AE299EFA7BA66DEAFEFBEFBF0B7D8B";

int base64dec(char c)
{
    int i;

    for (i = 0; i < 64; i++)
        if (B64[i] == c) return i;

    return 0;
}

char *encrypts(char *key,char *str) {
  char *result;
  unsigned int length;
  unsigned int left,right;
  char *s,*d;
  unsigned char *p;
  BF_KEY bfkey;
  int i;

  if(key==NULL||str==NULL) return NULL;

  length=strlen(str);
  BF_set_key(&bfkey, strlen(key), (const unsigned char *)key);

  s=(char *)malloc(length+9);

  strncpy(s,str,length);
  memset(s+length,0,9);

  result=(char *)malloc(((length%8==0) ? length/8*12 : 12+length/8*12)+1);

  p=(unsigned char *)s;
  d=result;

  while(*p) {
    BF_ecb_encrypt((const unsigned char *)p, (unsigned char *)p, &bfkey, BF_ENCRYPT);
    left = ((*p++) << 24);
    left += ((*p++) << 16);
    left += ((*p++) << 8);
    left += (*p++);
    right = ((*p++) << 24);
    right += ((*p++) << 16);
    right += ((*p++) << 8);
    right += (*p++);
    for (i = 0; i < 6; i++) {
        *d++=B64[right & 0x3f];
        right = (right >> 6);
    }

    for (i = 0; i < 6; i++) {
        *d++=B64[left & 0x3f];
        left = (left >> 6);
    }
  }
  *d = '\0';

  memset(s,0,length+9);
  free(s);
  return result;
}

char *decrypts(char *key, char *str) {
  char *result;
  unsigned int length;
  unsigned int left,right;
  int i;
  char *d;
  unsigned char *c;
  BF_KEY bfkey;

  if(key==NULL||str==NULL) return NULL;

  length=strlen(str);
  BF_set_key(&bfkey,strlen(key),(const unsigned char *)key);

  result=(char *)malloc((length/12*8)+1);
  c=(unsigned char *)result;
  d=str;
  while(*d) {
    right=0;
    left=0;
    for (i = 0; i < 6; i++) right |= (base64dec(*d++)) << (i * 6);
	for (i = 0; i < 6; i++) left |= (base64dec(*d++)) << (i * 6);
    right=htonl(right);
    left=htonl(left);
    memcpy(c,&left,4);
    memcpy(c+4,&right,4);
    BF_ecb_encrypt(c,c,&bfkey,BF_DECRYPT);
    c+=8;
  }
  *c='\0';
  return result;
}

class CKeyExchangeTimer : public CTimer {
public:
	CKeyExchangeTimer(CModule* pModule)
		    : CTimer(pModule, 5, 0, "KeyExchangeTimer", "Key exchange timer removes stale exchanges") {}

protected:
	virtual void RunJob();
};

class CFishMod : public CModule {
public:
	MODCONSTRUCTOR(CFishMod) {}
	virtual ~CFishMod() {
	}

        virtual EModRet OnPrivNotice(CNick& Nick, CString& sMessage) {
		CString command = sMessage.Token(0);
		CString sOtherPub_Key = sMessage.Token(1);

		if (command.CaseCmp("DH1080_INIT") == 0 && !sOtherPub_Key.empty()) {
		    CString sPriv_Key;
		    CString sPub_Key;
		    CString sSecretKey;

		    DH1080_gen(sPriv_Key, sPub_Key);
		    if (!DH1080_comp(sPriv_Key, sOtherPub_Key, sSecretKey)) {
			PutModule("Error in DH1080 with " + Nick.GetNick() + ": " + sSecretKey);
			return CONTINUE;
		    }
		    PutModule("Received DH1080 public key from " + Nick.GetNick() + ", sending mine...");
		    PutIRC("NOTICE " + Nick.GetNick() + " :DH1080_FINISH " + sPub_Key);
		    SetNV(Nick.GetNick().AsLower(), sSecretKey);
		    PutModule("Key for " + Nick.GetNick() + " successfully set.");
		    return HALT;
		} else if (command.CaseCmp("DH1080_FINISH") == 0 && !sOtherPub_Key.empty()) {
		    CString sPriv_Key;
		    CString sSecretKey;

		    map<CString, pair<time_t, CString> >::iterator it = m_msKeyExchange.find(Nick.GetNick().AsLower());
		    if (it == m_msKeyExchange.end()) {
			PutModule("Received unexpected DH1080_FINISH from " + Nick.GetNick() + ".");
		    } else {
			sPriv_Key = it->second.second;
			if (DH1080_comp(sPriv_Key, sOtherPub_Key, sSecretKey)) {
				SetNV(Nick.GetNick().AsLower(), sSecretKey);
				PutModule("Key for " + Nick.GetNick() + " successfully set.");
				m_msKeyExchange.erase(Nick.GetNick().AsLower());
			}
		    }
		    return HALT;
		} else {
			FilterIncoming(Nick.GetNick(), Nick, sMessage);
		}

                return CONTINUE;
        }

	virtual EModRet OnUserMsg(CString& sTarget, CString& sMessage) {
		MCString::iterator it = FindNV(sTarget.AsLower());

		if (it != EndNV()) {
			CChan* pChan = m_pNetwork->FindChan(sTarget);
			if ((pChan) && (pChan->AutoClearChanBuffer())) {
				pChan->AddBuffer(":" + m_pNetwork->GetIRCNick().GetNickMask() + " PRIVMSG " + sTarget + " :" + sMessage);
			}
			char * cMsg = encrypts((char *)it->second.c_str(), (char *)sMessage.c_str());

			CString sMsg = "+OK " + CString(cMsg);
			PutIRC("PRIVMSG " + sTarget + " :" + sMsg);
			m_pNetwork->PutUser(":" + m_pNetwork->GetIRCNick().GetNickMask() + " PRIVMSG " + sTarget + " :" + sMessage, NULL, m_pClient);

			free(cMsg);
			return HALTCORE;
		}

		return CONTINUE;
	}

	virtual EModRet OnUserAction(CString& sTarget, CString& sMessage) {
		MCString::iterator it = FindNV(sTarget.AsLower());

		if (it != EndNV()) {
			CChan* pChan = m_pNetwork->FindChan(sTarget);
			if ((pChan) && (pChan->AutoClearChanBuffer())) {
				pChan->AddBuffer(":" + m_pNetwork->GetIRCNick().GetNickMask() + " PRIVMSG " + sTarget + " :\001ACTION " + sMessage + "\001");
			}
			char * cMsg = encrypts((char *)it->second.c_str(), (char *)sMessage.c_str());

			CString sMsg = "+OK " + CString(cMsg);
			PutIRC("PRIVMSG " + sTarget + " :\001ACTION " + sMsg + "\001");
			m_pNetwork->PutUser(":" + m_pNetwork->GetIRCNick().GetNickMask() + " PRIVMSG " + sTarget + " :\001ACTION " + sMessage + "\001", NULL, m_pClient);

			free(cMsg);
			return HALTCORE;
		}

		return CONTINUE;
	}

	virtual EModRet OnUserNotice(CString& sTarget, CString& sMessage) {
		MCString::iterator it = FindNV(sTarget.AsLower());

		if (it != EndNV()) {
			CChan* pChan = m_pNetwork->FindChan(sTarget);
			if ((pChan) && (pChan->AutoClearChanBuffer())) {
				pChan->AddBuffer(":" + m_pNetwork->GetIRCNick().GetNickMask() + " NOTICE " + sTarget + " :" + sMessage);
			}
			char * cMsg = encrypts((char *)it->second.c_str(), (char *)sMessage.c_str());

			CString sMsg = "+OK " + CString(cMsg);
			PutIRC("NOTICE " + sTarget + " :" + sMsg);
			m_pNetwork->PutUser(":" + m_pNetwork->GetIRCNick().GetNickMask() + " NOTICE " + sTarget + " :" + sMessage, NULL, m_pClient);

			free(cMsg);
			return HALTCORE;
		}

		return CONTINUE;

	}

	virtual EModRet OnUserTopic(CString& sChannel, CString& sTopic) {
		if (!sTopic.empty()) {
			MCString::iterator it = FindNV(sChannel.AsLower());
			if (it != EndNV()) {
				char * cTopic = encrypts((char *)it->second.c_str(), (char *)sTopic.c_str());
				sTopic = "+OK " + CString(cTopic);
				free(cTopic);
			}
		}

		return CONTINUE;
	}

	virtual EModRet OnPrivMsg(CNick& Nick, CString& sMessage) {
		FilterIncoming(Nick.GetNick(), Nick, sMessage);
		return CONTINUE;
	}

	virtual EModRet OnChanMsg(CNick& Nick, CChan& Channel, CString& sMessage) {
		FilterIncoming(Channel.GetName(), Nick, sMessage);
		return CONTINUE;
	}

	virtual EModRet OnPrivAction(CNick& Nick, CString& sMessage) {
		FilterIncoming(Nick.GetNick(), Nick, sMessage);
		return CONTINUE;
	}

	virtual EModRet OnChanAction(CNick& Nick, CChan& Channel, CString& sMessage) {
		FilterIncoming(Channel.GetName(), Nick, sMessage);
		return CONTINUE;
	}

	virtual EModRet OnTopic(CNick& Nick, CChan& Channel, CString& sTopic) {
		FilterIncoming(Channel.GetName(), Nick, sTopic);
		return CONTINUE;
	}

	virtual EModRet OnRaw(CString& sLine) {
		if (sLine.WildCmp(":* 332 *") && sLine.Token(1) == "332") {
			CChan* pChan = m_pNetwork->FindChan(sLine.Token(3));
			if (pChan) {
				CNick Nick(sLine.Token(2));
				CString sTopic = sLine.Token(4, true);
				sTopic.LeftChomp();
				FilterIncoming(pChan->GetName(), Nick, sTopic);
				sLine = sLine.Token(0) + " " + sLine.Token(1) + " " + sLine.Token(2) + " " + pChan->GetName() + " :" + sTopic;
			}
		}
		return CONTINUE;
	}

	void FilterIncoming(const CString& sTarget, CNick& Nick, CString& sMessage) {
		if (sMessage.Left(4) == "+OK " || sMessage.Left(5) == "mcps ") {
			MCString::iterator it = FindNV(sTarget.AsLower());

			if (it != EndNV()) {
				if (sMessage.Left(4) == "+OK ") {
				    sMessage.LeftChomp(4);
				} else if (sMessage.Left(5) == "mcps ") {
				    sMessage.LeftChomp(5);
				}

				unsigned int msg_len = strlen(sMessage.c_str());

				if ((strspn(sMessage.c_str(), (char *)B64) != msg_len) || msg_len < 12) {
					return;
				}

				unsigned int mark_broken_block = 0;

				if (msg_len != (msg_len/12)*12) {
					msg_len = msg_len - (msg_len/12)*12;
					sMessage.RightChomp(msg_len);
					mark_broken_block = 1;
				}

				char *cMsg = decrypts((char *)it->second.c_str(), (char *)sMessage.c_str());
				sMessage = CString(cMsg);

				if (mark_broken_block) {
					sMessage += "  \002&\002";
				}

				free(cMsg);
			}
		}
	}

	virtual void OnModCommand(const CString& sCommand) {
		CString sCmd = sCommand.Token(0);

		if (sCmd.CaseCmp("DELKEY") == 0) {
			CString sTarget = sCommand.Token(1);

			if (!sTarget.empty()) {
				if (DelNV(sTarget.AsLower())) {
					PutModule("Target [" + sTarget + "] deleted");
				} else {
					PutModule("Target [" + sTarget + "] not found");
				}
			} else {
				PutModule("Usage DelKey <#chan|Nick>");
			}
		} else if (sCmd.CaseCmp("SETKEY") == 0) {
			CString sTarget = sCommand.Token(1);
			CString sKey = sCommand.Token(2, true);

			if (!sKey.empty()) {
				SetNV(sTarget.AsLower(), sKey);
				PutModule("Set encryption key for [" + sTarget + "] to [" + sKey + "]");
			} else {
				PutModule("Usage: SetKey <#chan|Nick> <Key>");
			}
		} else if (sCmd.CaseCmp("SHOWKEY") == 0) {
			CString sTarget = sCommand.Token(1);

			if (!sTarget.empty()) {
				MCString::iterator it = FindNV(sTarget.AsLower());

				if (it != EndNV()) {
					PutModule("Target key is " + it->second);
				} else {
					PutModule("Target not found.");
				}
			} else {
				PutModule("Usage ShowKey <#chan|Nick>");
			}
		} else if (sCmd.CaseCmp("LISTKEYS") == 0) {
			if (BeginNV() == EndNV()) {
				PutModule("You have no encryption keys set.");
			} else {
				CTable Table;
				Table.AddColumn("Target");
				Table.AddColumn("Key");

				for (MCString::iterator it = BeginNV(); it != EndNV(); it++) {
					Table.AddRow();
					Table.SetCell("Target", it->first);
					Table.SetCell("Key", it->second);
				}

				if (Table.size()) {
					unsigned int uTableIdx = 0;
					CString sLine;

					while (Table.GetLine(uTableIdx++, sLine)) {
						PutModule(sLine);
					}
				}
			}
		} else if (sCmd.CaseCmp("KEYX") == 0) {
			CString sTarget = sCommand.Token(1);

			if (sTarget.empty()) {
			    PutModule("You did not specify a target for the key exchange.");
			} else {
			    map<CString, pair<time_t, CString> >::iterator it = m_msKeyExchange.find(sTarget.AsLower());
			    if (it != m_msKeyExchange.end()) {
				PutModule("Keyexchange with " + sTarget + " already in progress.");
			    } else {
				CString sPriv_Key;
				CString sPub_Key;

				DH1080_gen(sPriv_Key, sPub_Key);
				m_msKeyExchange.insert(make_pair(sTarget.AsLower(), make_pair(time(NULL), sPriv_Key)));
				PutIRC("NOTICE " + sTarget + " :DH1080_INIT " + sPub_Key);
				PutModule("Sent my DH1080 public key to " + sTarget + ", waiting for reply ...");
				if (FindTimer("KeyExchangeTimer") == NULL) {
				    AddTimer(new CKeyExchangeTimer(this));
				}
			    }
			}
		} else if (sCmd.CaseCmp("HELP") == 0) {
			PutModule("Try: SetKey <target> <key>, DelKey <target>, ShowKey <target>, ListKeys, KeyX <target>");
		} else {
			PutModule("Unknown command, try 'Help'");
		}
	}

	void DelStaleKeyExchanges(time_t iTime) {
		map<CString, pair<time_t, CString> >::iterator it = m_msKeyExchange.begin();
		while (it != m_msKeyExchange.end()) {
		    if (iTime - 5 >= it->second.first) {
			PutModule("Keyexchange with " + it->first + " did expire before completition.");
		        it = m_msKeyExchange.erase(it);
		    } else {
				++it;
			}
		}
		if (m_msKeyExchange.size() <= 0) {
		    RemTimer("KeyExchangeTimer");
		}
	}

private:

	void DH1080_gen(CString& sPriv_Key, CString& sPub_Key) {
		sPriv_Key = "";
		sPub_Key = "";

		unsigned char raw_buf[200];
		unsigned long len;
		unsigned char *a, *b;

		initb64();

		DH *dh;
		dh=DH_new();
		BIGNUM *b_prime=NULL;
		BIGNUM *b_generator=NULL;

		if (!BN_hex2bn(&b_prime, prime1080)) {
		    return;
		}

		if (!BN_dec2bn(&b_generator, "2")) {
		    return;
		}

		if (b_prime == NULL || b_generator == NULL ||
		    !DH_set0_pqg(dh, b_prime, NULL, b_generator))
			return;


		if (!DH_generate_key(dh)) {
		    return;
		}

		const BIGNUM *priv_key, *pub_key;
		DH_get0_key(dh, &pub_key, &priv_key);

		len = BN_num_bytes(priv_key);
		a = (unsigned char *)malloc(len);
		BN_bn2bin(priv_key,a);

		memset(raw_buf, 0, 200);
		htob64((char *)a, (char *)raw_buf, len);
		sPriv_Key = CString((char *)raw_buf);
		len=BN_num_bytes(pub_key);
		b = (unsigned char *)malloc(len);
		BN_bn2bin(pub_key,b);
		memset(raw_buf, 0, 200);
		htob64((char *)b, (char *)raw_buf, len);
		sPub_Key = CString((char *)raw_buf);
		DH_free(dh);
		free(a);
		free(b);
	}


	bool DH1080_comp(CString& sPriv_Key, CString& sOtherPub_Key, CString& sSecret_Key) {
		int len;
		unsigned char SHA256digest[32];
		char *key;
		BIGNUM *b_prime=NULL;
		BIGNUM *b_myPrivkey=NULL;
		BIGNUM *b_HisPubkey=NULL;
		BIGNUM *b_generator=NULL;
		DH *dh;
		CString sSHA256digest;
		unsigned char raw_buf[200];

		if (!BN_hex2bn(&b_prime, prime1080)) {
		    return false;
		}

		if (!BN_dec2bn(&b_generator, "2")) {
		    return false;
		}

		dh=DH_new();
		if (b_prime == NULL || b_generator == NULL ||
		    !DH_set0_pqg(dh, b_prime, NULL, b_generator))
			return false;

		memset(raw_buf, 0, 200);
		len = b64toh((char *)sPriv_Key.c_str(), (char *)raw_buf);
		b_myPrivkey=BN_bin2bn(raw_buf, len, NULL);

		DH_set0_key(dh, NULL, b_myPrivkey);

		memset(raw_buf, 0, 200);
		len = b64toh((char *)sOtherPub_Key.c_str(), (char *)raw_buf);

		b_HisPubkey=BN_bin2bn(raw_buf, len, NULL);

		key=(char *)malloc(DH_size(dh));
		memset(key, 0, DH_size(dh));
		len=DH_compute_key((unsigned char *)key, b_HisPubkey, dh);
		if (len == -1) {
			// Bad pub key
			unsigned long err = ERR_get_error();
			DEBUG("** DH Error:" << ERR_error_string(err,NULL));
			DH_free(dh);
			BN_clear_free(b_HisPubkey);
			free(key);

			sSecret_Key = CString(ERR_error_string(err,NULL)).Token(4,true,":");
			return false;
		}

		SHA256_CTX c;
		SHA256_Init(&c);
		memset(SHA256digest, 0, 32);
		SHA256_Update(&c, key, len);
		SHA256_Final(SHA256digest, &c);
		memset(raw_buf, 0, 200);
		len = htob64((char *)SHA256digest, (char *)raw_buf, 32);
		sSecret_Key = "";
		sSecret_Key.append((char *)raw_buf, len);

		DH_free(dh);
		BN_clear_free(b_HisPubkey);
		free(key);
		return true;
	}

	map<CString, pair<time_t, CString> >	m_msKeyExchange;

};

void CKeyExchangeTimer::RunJob() {
		CFishMod *p = (CFishMod *)m_pModule;
		p->DelStaleKeyExchanges(time(NULL));
}

MODULEDEFS(CFishMod, "FiSH encryption for channel/private messages")