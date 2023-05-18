import React from 'react';
import ReactDOM from 'react-dom';
import SemanticAnalyzer from '../SemanticAnalyzer';
import * as cls from '../LexicalAnalyzer/Classifications'
import * as ptn from './Patterns'

class SyntaxAnalyzer extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            lexemes: this.props.lexemes,
            identifiers: this.props.identifiers,
            classifications: "", 
            
        }
        this.getClassifications = this.getClassifications.bind(this);
        this.checkSyntax = this.checkSyntax.bind(this);
        this.convertString = this.convertString.bind(this);
        this.getSymbols = this.getSymbols.bind(this)
    }
    componentDidMount(){ 
        //changed to componentDidMount since we will unmount and remount the component
        //everytiime we click the execute button
        this.setState({
                classifications:this.getClassifications(this.state.lexemes)
            })
        const semanticanalyzer = document.getElementById('semanticanalyzer');
        var lex = []
        for (let index = 0; index < this.state.lexemes.length; index++) {
            lex.push(this.state.lexemes[index].slice())  
        }
        ReactDOM.render(<SemanticAnalyzer data={lex} func={{getSymbols: this.getSymbols.bind(this)}} func1 = {{getText: this.getText.bind(this)}} func2 = {{getInput: this.getInput.bind(this)}}/>, semanticanalyzer);
    }

    getSymbols(symbols){
        this.props.func.getSemanticOutput(symbols);
    }

    getText(text){
        this.props.func1.getText(text);
    }

    async getInput(){
        return this.props.func2.getInput();
    }

    /* All the classifications of the lexemes will be put into a list   
        The element of the list will then be joined with an underscore(_)
        making it a string.
        This string will then be check for its syntax.
    */
    getClassifications(lexemes){
        var classifications = []
        for (let index = 0; index < lexemes.length; index++) {
            classifications.push(lexemes[index][1])
        }
        classifications = String(classifications.join("_"))
        this.convertString(classifications);
        return classifications
    }
   
    convertString(str){
        
        str = str.replace(ptn.comment,"")
        str = str.replace(/Start Code Delimiter_Float Literal/g,"Start Code Delimiter")
        str = str.replace(/New line_Start Code Delimiter/g,"Start Code Delimiter")
        str = str.replace(ptn.switch_value,"caseLiteral")
        str = str.replace(ptn.vars,"variable")
        str = str.replace(/-.*_/,"_")
        str = str.replace(ptn.literal,"expression")
        str = str.replace(ptn.operations,"expression")
        str = str.replace(ptn.input,"input")
        str = str.replace(ptn.typecast,"typecast")
        
        while(str.match(ptn.operations)){
            str = str.replace(ptn.operations,"expression")
        }
        str = str.replace(ptn.inf_and,"expression")
        str = str.replace(ptn.inf_or,"expression")
        
        // Statements
        str = str.replace(ptn.declaration,"declaration")
        str = str.replace(ptn.assignment,"assignment")
        str = str.replace(ptn.output,"output_")
        str = str.replace(ptn.loop_expr,"loopExpr")
        
        str = str.replace(ptn.statement1,"statement")
        
        /* If, Switch, and Loop Statements */
        str = str.replace(ptn.statement2,"statement_")
        str = str.replace(ptn.statement3,"statement_New line_")
        str = str.replace(ptn.if_block,"statement")
        str = str.replace(ptn.switch_cases,"cases_")
        str = str.replace(ptn.default_case,"default_")
        str = str.replace(ptn.switch_block,"statement")
        str = str.replace(ptn.loop_block,"statement")
        
        /* FINALIZE */
        str = str.replace(ptn.statement2,"statement_")
        str = str.replace(ptn.statement3,"statement_New line_")
        str = str.replace(/(New line_?)+/g,"New line_")
        str = str.replace(/End Code Delimiter_New line_/g,"End Code Delimiter")
        str = str.replace(ptn.program,"")
        
        this.checkSyntax(str)
    }
    /* ERROR CHECKING */
    checkSyntax(str){ 
        var errorMessage = "";
        var errorString = str.split("_")

        for(let i=0; i<errorString.length; i++){

            /* Program */
            if(i === 0){
                if(errorString[i] !== cls.begin_program){ 
                    if(errorString[i] !== cls.start_comment &&
                        errorString[i] !== cls.comment_unary){
                        errorMessage ="Syntax Error: Code should begin with code delimiter HAI"
                        break;
                    }
                }
            }
            if(i === errorString.length-1){
                if(errorString[i] !== cls.end_program){
                    errorMessage ="Syntax Error: Code should end with code delimiter KTHXBYE"
                    break;
                }
            }

            /* Comments */
            if(errorString[i] === cls.start_comment){
                errorMessage ="Syntax Error: Wrong/Missing end comment delimiter: TLDR"
                break;
            }
            if(errorString[i] === cls.end_comment){
                errorMessage ="Syntax Error: Wrong/Missing start comment delimiter: OBTW"
                break;
            }

            /* Variables */
            if(errorString[i].match(ptn.variable) ){
                let varnum = errorString[i].substring(8,errorString[i].length)
                let err_var = this.state.identifiers[varnum]
                if(errorString[i+1] === cls.variable_assign){
                    errorMessage ="Syntax Error: Wrong/Missing value in '" + err_var + " R'"
                }
                else errorMessage ="Syntax Error: Unexpected identifier: " + err_var 
                break;
            }
            if(errorString[i] === cls.variable_decl){
                errorMessage ="Syntax Error: Wrong/Missing argument after 'I HAS A'"
                break;
            }
            if(errorString[i] === cls.variable_init){
                errorMessage ="Syntax Error: Wrong/Missing argument in 'ITZ'"
                break;
            }
            if(errorString[i] === cls.variable_assign){
                errorMessage ="Syntax Error: Wrong/Missing argument before 'R'"
                break;
            }

            /* Operations */
            if(errorString[i] === cls.addition_op){
                errorMessage ="Syntax Error: Wrong/Missing arguments in 'SUM OF' operation"
                break;
            }
            if(errorString[i] === cls.subtraction_op){
                errorMessage ="Syntax Error: Wrong/Missing arguments in 'DIFF OF' operation"
                break;
            }
            if(errorString[i] === cls.multiplication_op){
                errorMessage ="Syntax Error: Wrong/Missing arguments in 'PRODUKT OF' operation"
                break;
            }
            if(errorString[i] === cls.division_op){
                errorMessage ="Syntax Error: Wrong/Missing arguments in 'QUOSHUNT OF' operation"
                break;
            }
            if(errorString[i] === cls.modulo_op){
                errorMessage ="Syntax Error: Wrong/Missing arguments in 'MOD OF' operation"
                break;
            }
            if(errorString[i] === cls.greater_than){
                errorMessage ="Syntax Error: Wrong/Missing arguments in 'BIGGR OF' operation"
                break;
            }
            if(errorString[i] === cls.less_than){
                errorMessage ="Syntax Error: Wrong/Missing arguments in 'SMALLR OF' operation"
                break;
            }
            if(errorString[i] === cls.equal_op){
                errorMessage ="Syntax Error: Wrong/Missing arguments in 'BOTH SAEM' operation"
                break;
            }
            if(errorString[i] === cls.not_equal_op){
                errorMessage ="Syntax Error: Wrong/Missing arguments in 'DIFFRINT' operation"
                break;
            }
            if(errorString[i] === cls.and_op){
                errorMessage ="Syntax Error: Wrong/Missing arguments in 'BOTH OF' operation"
                break;
            }
            if(errorString[i] === cls.or_op){
                errorMessage ="Syntax Error: Wrong/Missing arguments in 'EITHER OF' operation"
                break;
            }
            if(errorString[i] === cls.xor_op){
                errorMessage ="Syntax Error: Wrong/Missing arguments in 'WON OF' operation"
                break;
            }
            if(errorString[i] === cls.not_op){
                errorMessage ="Syntax Error: Wrong/Missing argument in 'NOT' operation"
                break;
            }
            if(errorString[i] === cls.increment_op){
                errorMessage ="Syntax Error: Wrong/Missing argument in 'UPPIN' operation"
                break;
            }
            if(errorString[i] === cls.decrement_op){
                errorMessage ="Syntax Error: Wrong/Missing argument in 'NERFIN' operation"
                break;
            }
            if(errorString[i] === cls.infinite_or){
                errorMessage ="Syntax Error: Wrong/Missing argument in 'ANY OF' operation"
                break;
            }
            if(errorString[i] === cls.infinite_and){
                errorMessage ="Syntax Error: Wrong/Missing argument in 'ALL OF' operation"
                break;
            }

            /* Keywords */
            if(errorString[i] === cls.separator){
                errorMessage ="Syntax Error: Wrong/Missing arguments in separator 'AN'"
                break;
            }
            if(errorString[i] === cls.output_key){
                errorMessage ="Syntax Error: Wrong/Missing arguments in output keyword 'VISIBLE'"
                break;
            }
            if(errorString[i] === cls.input_key){
                errorMessage ="Syntax Error: Wrong/Missing arguments in input keyword 'GIMMEH'"
                break;
            }
            
            /* Invalid lexemes */
            if(errorString[i] === cls.invalid){
                errorMessage ="Syntax Error: Unknown token: "
                break;
            }    

        }
        this.props.data.getSyntaxError(errorMessage);
    }

    render(){
        return(
            <div>
                <div id='semanticanalyzer'></div> {/*div that will hold the <semanticAnalyzer>*/}
            </div>
        )
    }
}

export default SyntaxAnalyzer;