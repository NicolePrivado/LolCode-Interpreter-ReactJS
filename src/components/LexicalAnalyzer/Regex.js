
/* Identifiers */
export const identifier = /^([a-zA-Z]+[_a-zA-Z0-9]*\s+)/;
export const varident = /^([a-zA-Z]+[_a-zA-Z0-9]*)/

/* Literals */
export const numbr_lit = /^(-?[0-9]+\s+)/;
export const integer =  /^(-?[0-9]+)/;
export const numbar_lit = /^(-?[0-9]*\.[0-9]+\s+)/;
export const float = /^(-?[0-9]*\.[0-9]+)/;
export const yarn_lit = /^([^"]*)/;
export const troof_lit = /^((WIN|FAIL)\s+)/;
export const boolean = /^((WIN|FAIL))/;
export const type_lit = /^((NUMBR|NUMBAR|YARN|TROOF|NOOB|TYPE)\s+)/;
export const type = /^(NUMBR|NUMBAR|YARN|TROOF|NOOB|TYPE)/;

/* Additional */
export const comment = /^([^\n]*)/;
export const comment1 = /^((.|\s)*)/;
export const comment2 = /^((.|\s)*?(?=TLDR))/;
export const eol = /^([\n\r,]+)/;
export const space = /^(\s+)/
export const str_delimiter = /^(")/;
export const invalid = /^([^\s]+\s+)/;

/* Keywords */
export const HAI = /^(HAI\s+)/;     
export const KTHXBYE = /^(KTHXBYE(\s+)?)/;
export const BTW = /^(BTW\s+)/;
export const OBTW = /^(OBTW\s+)/;
export const OBTW1 = /^(OBTW\s+(.|\s)*?(?=(\n)+TLDR))/;  // complete
export const OBTW2 = /^(OBTW\s+(.|\s)*)/;           //incomplete
export const TLDR = /^(TLDR\s+|TLDR)/;
export const I_HAS_A = /^(I HAS A\s+)/;
export const ITZ = /^(ITZ\s+)/;
export const R = /^(R\s+)/;
export const SUM_OF = /^(SUM OF\s+)/;
export const DIFF_OF = /^(DIFF OF\s+)/;
export const PRODUKT_OF = /^(PRODUKT OF\s+)/;
export const QUOSHUNT_OF = /^(QUOSHUNT OF\s+)/;
export const MOD_OF = /^(MOD OF\s+)/;
export const BIGGR_OF = /^(BIGGR OF\s+)/;
export const SMALLR_OF = /^(SMALLR OF\s+)/;
export const BOTH_OF = /^(BOTH OF\s+)/;
export const EITHER_OF = /^(EITHER OF\s+)/;
export const WON_OF = /^(WON OF\s+)/;
export const NOT = /^(NOT\s+)/;
export const ANY_OF = /^(ANY OF\s+)/;
export const ALL_OF = /^(ALL OF\s+)/;
export const BOTH_SAEM = /^(BOTH SAEM\s+)/;
export const DIFFRINT = /^(DIFFRINT\s+)/;
export const SMOOSH = /^(SMOOSH\s+)/;
export const MAEK = /^(MAEK\s+)/;
export const A = /^(A\s+)/;
export const IS_NOW_A = /^(IS NOW A\s+)/;
export const VISIBLE = /^(VISIBLE\s+)/;
export const GIMMEH = /^(GIMMEH\s+)/;
export const O_RLY = /^(O RLY\?\s+)/;
export const YA_RLY = /^(YA RLY\s+)/;
export const MEBBE = /^(MEBBE\s+)/;
export const NO_WAI = /^(NO WAI\s+)/;
export const OIC = /^(OIC\s+)/;
export const WTF = /^(WTF\?\s+)/;
export const OMG = /^(OMG\s+)/;
export const OMGWTF = /^(OMGWTF\s+)/;
export const IM_IN_YR = /^(IM IN YR\s+)/;
export const UPPIN = /^(UPPIN\s+)/;
export const NERFIN = /^(NERFIN\s+)/;
export const YR = /^(YR\s+)/;
export const TIL = /^(TIL\s+)/;
export const WILE = /^(WILE\s+)/;
export const IM_OUTTA_YR = /^(IM OUTTA YR\s+)/;
export const MKAY = /^(MKAY\s+)/;
export const AN = /^(AN\s+)/;
export const GTFO = /^(GTFO\s+)/;