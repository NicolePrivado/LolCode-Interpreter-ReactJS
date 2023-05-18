import React from 'react';
import ReactDOM from 'react-dom';
import SyntaxAnalyzer from '../SyntaxAnalyzer';
import * as rgx from './Regex';
import * as cls from './Classifications';

class LexicalAnalyzer extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            lexemes: [],
            identifiers: [],
        }
        this.classify = this.classify.bind(this);
        this.addToken = this.addToken.bind(this);
    }
    componentDidMount(){ 
        //changed to componentDidMount since we will unmount and remount the component
        //everytiime we click the execute button
        this.classify(this.props.str);
        const syntaxanalyzer = document.getElementById('syntaxanalyzer');
        console.log(this.state.lexemes)
        // Lexemes will be passed to the syntax analyzer
        ReactDOM.render(<SyntaxAnalyzer lexemes={this.state.lexemes} />, syntaxanalyzer);
    }

    addToken(string,regx,classification){
        var s, str;
        s = string.split(regx); // Returns an array with 3 elements ["",Keyword,Rest of string] 
        str = s[1].trim();     // Keyword assigned to s1
        // Push to array
        if(s[1]){
            if(s[1]!=="\n") {
                if (classification === "Variable Identifier" && !this.state.identifiers.includes(str)){
                    this.state.identifiers.push(str)
                    this.state.lexemes.push([str,classification+"-"+str]);
                    //this.setState({var_counter: this.state.var_counter+1})
                }
                else if (this.state.identifiers.includes(str)){
                    this.state.lexemes.push([str,classification+"-"+str]);
                }
                else this.state.lexemes.push([str,classification]);
                
            } 
            else {
                this.state.lexemes.push([s[1],classification]);
            }
        }
        string = s[s.length-1]; // Update string
        return string;  // Return updated string
    }

    classify(string){
        while(string.length!==0){
            
            if(string.match(rgx.HAI)){  
                string = this.addToken(string,rgx.HAI,cls.begin_program)           
            }
            else if(string.match(rgx.KTHXBYE)){   
                string = this.addToken(string,rgx.KTHXBYE,cls.end_program)           
            }
            else if(string.match(rgx.BTW)){  
                string = this.addToken(string,rgx.BTW,cls.comment_unary) 
                if(string.match(rgx.comment)){      // comment content
                    string = this.addToken(string,rgx.comment,cls.comment_content) 
                }
            }
            else if(string.match(rgx.OBTW1)){  
                string = this.addToken(string,rgx.OBTW,cls.start_comment)
                string = this.addToken(string,rgx.comment2,cls.comment_content)
                string = this.addToken(string,rgx.TLDR,cls.end_comment)
            }
            else if(string.match(rgx.OBTW2)){ 
                string = this.addToken(string,rgx.OBTW,cls.start_comment)
                string = this.addToken(string,rgx.comment1,cls.comment_content)
            }
            else if(string.match(rgx.TLDR)){ 
                string = this.addToken(string,rgx.TLDR,cls.end_comment)
            }
            else if(string.match(rgx.I_HAS_A)){   
                string = this.addToken(string,rgx.I_HAS_A,cls.variable_decl)           
            }
            else if(string.match(rgx.ITZ)){   
                string = this.addToken(string,rgx.ITZ,cls.variable_init)           
            }
            else if(string.match(rgx.R)){   
                string = this.addToken(string,rgx.R,cls.variable_assign)           
            }
            else if(string.match(rgx.SUM_OF)){   
                string = this.addToken(string,rgx.SUM_OF,cls.addition_op)           
            }
            else if(string.match(rgx.DIFF_OF)){   
                string = this.addToken(string,rgx.DIFF_OF,cls.subtraction_op)           
            }
            else if(string.match(rgx.PRODUKT_OF)){   
                string = this.addToken(string,rgx.PRODUKT_OF,cls.multiplication_op)           
            }
            else if(string.match(rgx.QUOSHUNT_OF)){   
                string = this.addToken(string,rgx.QUOSHUNT_OF,cls.division_op)           
            }
            else if(string.match(rgx.MOD_OF)){   
                string = this.addToken(string,rgx.MOD_OF,cls.modulo_op)           
            }
            else if(string.match(rgx.BIGGR_OF)){   
                string = this.addToken(string,rgx.BIGGR_OF,cls.greater_than)           
            }
            else if(string.match(rgx.SMALLR_OF)){   
                string = this.addToken(string,rgx.SMALLR_OF,cls.less_than)           
            }
            else if(string.match(rgx.BOTH_SAEM)){   
                string = this.addToken(string,rgx.BOTH_SAEM,cls.equal_op)           
            }
            else if(string.match(rgx.DIFFRINT)){   
                string = this.addToken(string,rgx.DIFFRINT,cls.not_equal_op)           
            }
            else if(string.match(rgx.BOTH_OF)){   
                string = this.addToken(string,rgx.BOTH_OF,cls.and_op)           
            }
            else if(string.match(rgx.EITHER_OF)){   
                string = this.addToken(string,rgx.EITHER_OF,cls.or_op)           
            }
            else if(string.match(rgx.WON_OF)){   
                string = this.addToken(string,rgx.WON_OF,cls.xor_op)           
            }
            else if(string.match(rgx.NOT)){   
                string = this.addToken(string,rgx.NOT,cls.not_op)           
            }
            else if(string.match(rgx.ANY_OF)){   
                string = this.addToken(string,rgx.ANY_OF,cls.infinite_or)           
            }
            else if(string.match(rgx.ALL_OF)){   
                string = this.addToken(string,rgx.ALL_OF,cls.infinite_and)           
            }
            else if(string.match(rgx.SMOOSH)){   
                string = this.addToken(string,rgx.SMOOSH,cls.concat)           
            }
            else if(string.match(rgx.MAEK)){   
                string = this.addToken(string,rgx.MAEK,cls.prefix_typecast)           
            }
            else if(string.match(rgx.IS_NOW_A)){   
                string = this.addToken(string,rgx.IS_NOW_A,cls.infix_typecast)           
            }
            else if(string.match(rgx.AN)){   
                string = this.addToken(string,rgx.AN,cls.separator)           
            }
            else if(string.match(rgx.A)){   
                string = this.addToken(string,rgx.A,cls.type_assign)           
            }
            else if(string.match(rgx.VISIBLE)){
                string = this.addToken(string,rgx.VISIBLE,cls.output_key) 
            } 
            else if(string.match(rgx.GIMMEH)){   
                string = this.addToken(string,rgx.GIMMEH,cls.input_key)           
            } 
            else if(string.match(rgx.O_RLY)){   
                string = this.addToken(string,rgx.O_RLY,cls.start_cond)           
            }      
            else if(string.match(rgx.OIC)){   
                string = this.addToken(string,rgx.OIC,cls.end_cond)           
            }
            else if(string.match(rgx.YA_RLY)){   
                string = this.addToken(string,rgx.YA_RLY,cls.if_key)           
            }
            else if(string.match(rgx.MEBBE)){   
                string = this.addToken(string,rgx.MEBBE,cls.elseif)           
            }
            else if(string.match(rgx.NO_WAI)){   
                string = this.addToken(string,rgx.NO_WAI,cls.else_key)           
            }
            else if(string.match(rgx.OMGWTF)){   
                string = this.addToken(string,rgx.OMGWTF,cls.default_key)           
            }
            else if(string.match(rgx.OMG)){   
                string = this.addToken(string,rgx.OMG,cls.case_key)           
            }
            else if(string.match(rgx.WTF)){   
                string = this.addToken(string,rgx.WTF,cls.start_switch)           
            }
            else if(string.match(rgx.IM_IN_YR)){   
                string = this.addToken(string,rgx.IM_IN_YR,cls.start_loop)           
            }
            else if(string.match(rgx.UPPIN)){   
                string = this.addToken(string,rgx.UPPIN,cls.increment_op)           
            }
            else if(string.match(rgx.NERFIN)){   
                string = this.addToken(string,rgx.NERFIN,cls.decrement_op)           
            }
            else if(string.match(rgx.YR)){   
                string = this.addToken(string,rgx.YR,cls.loop_testvar)           
            }
            else if(string.match(rgx.TIL)){   
                string = this.addToken(string,rgx.TIL,cls.loop_cond)           
            }
            else if(string.match(rgx.WILE)){   
                string = this.addToken(string,rgx.WILE,cls.loop_cond)           
            }
            else if(string.match(rgx.GTFO)){   
                string = this.addToken(string,rgx.GTFO,cls.break_key)           
            }
            else if(string.match(rgx.IM_OUTTA_YR)){   
                string = this.addToken(string,rgx.IM_OUTTA_YR,cls.end_loop)           
            }
            else if(string.match(rgx.MKAY)){   
                string = this.addToken(string,rgx.MKAY,cls.end_statement)           
            }
            /* Symbols, Literals, and Identifiers */
            else if(string.match(rgx.eol)){
                string = this.addToken(string,rgx.eol,cls.eol) 
            }
            else if(string.match(rgx.space)) string = string.trim();
            else if(string.match(rgx.str_delimiter)){
                string = this.addToken(string,rgx.str_delimiter,cls.start_string)
                if (string.match(rgx.yarn_lit)){
                    string = this.addToken(string,rgx.yarn_lit,cls.string)
                    if(string.match(rgx.str_delimiter)){
                        string = this.addToken(string,rgx.str_delimiter,cls.end_string)
                    } 
                }
            }
            else if(string.match(rgx.numbar_lit)){
                string = this.addToken(string,rgx.float,cls.float_literal) 
            }
            else if(string.match(rgx.numbr_lit)){
                string = this.addToken(string,rgx.integer,cls.integer_literal) 
            }
            else if(string.match(rgx.troof_lit)){
                string = this.addToken(string,rgx.boolean,cls.boolean_literal) 
            }
            else if(string.match(rgx.type_lit)){
                string = this.addToken(string,rgx.type,cls.type) 
            }
            else if(string.match(rgx.identifier)){
                string = this.addToken(string,rgx.varident,cls.varident) 
               
            }
            else if(string.match(rgx.invalid)){
                string = this.addToken(string,rgx.invalid,cls.invalid) 
            }
            else{
                break;
            }
        }
        
        this.props.data.getLexicalOutput([this.state.lexemes,this.state.identifiers]);
    }

    render(){
        return(
            <div>
                <div id='syntaxanalyzer'></div> {/*div that will hold the <syntaxAnalyzer>*/}
            </div>
        )
    }
}

export default LexicalAnalyzer;