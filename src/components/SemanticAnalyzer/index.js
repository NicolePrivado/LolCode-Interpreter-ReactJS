import React from 'react';
import * as cls from '../LexicalAnalyzer/Classifications'

const init_value = ''
const operators = [cls.addition_op,cls.subtraction_op,cls.multiplication_op,cls.division_op,cls.modulo_op,cls.greater_than,cls.less_than,cls.equal_op,cls.not_equal_op,cls.and_op,cls.or_op,cls.xor_op,cls.not_op, cls.infinite_and, cls.infinite_or]

class SemanticAnalyzer extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            lexemes: [...this.props.data],
            symbol_table: [["IT",init_value]],
            text: [],  
        }
        
        this.cleanArr = this.cleanArr.bind(this)
        this.findVariables = this.findVariables.bind(this);
        this.findExpressions = this.findExpressions.bind(this);
        this.findStatements = this.findStatements.bind(this);
        this.solveExpression = this.solveExpression.bind(this);
        this.solveCondition = this.solveCondition.bind(this);
        this.solveSwitch = this.solveSwitch.bind(this);
        this.solveLoop = this.solveLoop.bind(this);
        this.findIO = this.findIO.bind(this);
    }

    componentDidMount(){
        this.props.func.getSymbols(this.state.symbol_table);
        this.cleanArr()
    }

    /* Removes comment, code delimiter, and string delimiter */
    cleanArr(){
        var arr = this.state.lexemes;
        var c;
        for (let i = 0; i< arr.length; i++) {
            c = arr[i][1]
            if(c.match(/Comment/) || c.match(/Code/) || c.match(/String Delimiter/)){
                arr.splice(i,1);
                i--;
            }
        }
        arr = this.findVariables(arr)
        this.findIO(arr)
    }
    /**** FOR FIXING: IT variable implementation *****/
    /* Find variable declaration/initialization */
    findVariables(arr){
        try {
            for (let i = 0; i< arr.length; i++) {
                /* With initialization */
                if(arr[i][1].match(cls.variable_decl)  && arr[i+1][1].match(cls.varident)  && arr[i+2][1].match(cls.variable_init) && arr[i+3][1].match(/Literal/)){
                    this.state.symbol_table.push([arr[i+1][0], arr[i+3][0]])
                    this.state.symbol_table[0][1] = arr[i+3][0]
                }
                /* Without initialization */
                else if(arr[i][1].match(cls.variable_decl)  && arr[i+1][1].match(cls.varident)){
                    this.state.symbol_table.push([arr[i+1][0],init_value])
                }
            }
            let temp = []
            arr = this.findExpressions(arr)
            while(true){
                temp = this.findExpressions(arr)
                if(arr !== temp) arr = temp;
                else break
            }
            return arr
        } catch (error) {}
    }

    /* Find and solve expressions */
    findExpressions(arr){ 
        var c, temp,n;
        for (let i = arr.length-1; i >= 0; i--) {
            c = arr[i][1]
            /* If an expression operator is found, it will be removed from the array and 
            will be replaced with the evaluated answer */
            if(operators.includes(c) && arr[i-1][1] !== cls.loop_cond){
                n = 0
                while(arr[i+n][1]!==cls.eol) n++;
                temp = this.solveExpression(arr,i,i+n);
                if(temp !== null){
                    this.state.symbol_table[0][1] = temp[0][0]
                    arr.splice(i,n,temp[0]);
                    let j = i + 1;
                    for (let x = 1; x < temp.length; x++) {
                        arr.splice(j,0,temp[x]);   // Replace
                        j++;
                    }
                }
            }
        }
        return this.findStatements(arr)
    }
    
    /* Solves found expression */
    solveExpression(arr,startIndex,endIndex){
        
        var str = String(arr[startIndex][0]).slice()
        for (let i= (startIndex+1); i < (endIndex+1); i++) {
            str = str.concat(" ",arr[i][0])
        }

        // Convert to prefix notation
        str = str.replace(/SUM OF/g,"+")
        str = str.replace(/DIFF OF/g,"-")
        str = str.replace(/PRODUKT OF/g,"*")
        str = str.replace(/QUOSHUNT OF/g,"/")
        str = str.replace(/MOD OF/g,"%")
        str = str.replace(/BIGGR OF/g,"max")
        str = str.replace(/SMALLR OF/g,"min")
        str = str.replace(/BOTH OF/g,"&&")
        str = str.replace(/ALL OF/g,"&&&")  // ALL OF
        str = str.replace(/EITHER OF/g,"||")
        str = str.replace(/ANY OF/g,"|||") // ANY OF
        str = str.replace(/WON OF/g,"^")        // XOR
        str = str.replace(/NOT/g,"!")
        str = str.replace(/BOTH SAEM/g,"===")
        str = str.replace(/DIFFRINT/g,"!==")
        str = str.replace(/AN/g,"")
        str = str.replace(/WIN/g,"true")
        str = str.replace(/FAIL/g,"false")
        str = str.replace(/\s+/g,",")
        
        let trails = []
        let is_XOR = false;

        // Format String
        let spl = str.split(',')
        if(spl[0] === "^") is_XOR = true;
        if(spl[0] === "max"){
            // Trailing values
            if(spl.length > 4 ){
                for (let i = 3; i < spl.length-1; i++) {
                    spl[i] = spl[i].toString().replace(/true/g,"WIN")
                    spl[i] = spl[i].toString().replace(/false/g,"FAIL")
                    if(is_XOR){
                        spl[i] = spl[i].toString().replace(/1/g,"WIN")
                        spl[i] = spl[i].toString().replace(/0/g,"FAIL")
                    }
                    trails.push([spl[i],"Literal"])
                }
            }
            spl = [ "Math.max( "+ spl[1] + ", " + spl[2] + " )" ]
        }
        else if(spl[0] === "min"){
            // Trailing values
            if(spl.length > 4 ){
                for (let i = 3; i < spl.length-1; i++) {
                    spl[i] = spl[i].toString().replace(/true/g,"WIN")
                    spl[i] = spl[i].toString().replace(/false/g,"FAIL")
                    if(is_XOR){
                        spl[i] = spl[i].toString().replace(/1/g,"WIN")
                        spl[i] = spl[i].toString().replace(/0/g,"FAIL")
                    }
                    trails.push([spl[i],"Literal"])
                }
            }
            spl = [ "Math.min( "+ spl[1] + ", " + spl[2] + " )" ]
        }
        // Not
        else if(spl[0] === "!"){
            spl = [ spl[0] +" " + spl[1]  ]
        }
        // ALL OF
        else if(spl[0] === "&&&"){      
            let temp = [" "]
            for (let i= 1; i < spl.length-2; i++) {
                temp.push(spl[i])
                temp.push(" && ")
            }
            temp.push(spl[spl.length-2])
            spl = temp
        }
        // ANY OF
        else if(spl[0] === "|||"){      
            let temp = [" "]
            for (let i= 1; i < spl.length-2; i++) {
                temp.push(spl[i])
                temp.push(" || ")
            }
            temp.push(spl[spl.length-2])
            spl = temp
        }
        else{
            // Trailing values
            if(spl.length > 4 ){
                for (let i = 3; i < spl.length-1; i++) {
                    spl[i] = spl[i].toString().replace(/true/g,"WIN")
                    spl[i] = spl[i].toString().replace(/false/g,"FAIL")
                    if(is_XOR){
                        spl[i] = spl[i].toString().replace(/1/g,"WIN")
                        spl[i] = spl[i].toString().replace(/0/g,"FAIL")
                    }
                    trails.push([spl[i],"Literal"])
                }
            }
            // Convert to infix notation
            spl = [ " " + spl[1], spl[0], spl[2] ]
        }
        
        // Convert variables to values
        let str1 = spl.join(' ')
        for (let i = 0; i < this.state.symbol_table.length; i++) {
            if(this.state.symbol_table[i][1] !== init_value){
                str1 = str1.replace(' ' + this.state.symbol_table[i][0], ' ' + this.state.symbol_table[i][1])
            }
        }
        // Bool values
        str1 = str1.replace(/WIN/g,"true")
        str1 = str1.replace(/FAIL/g,"false")
        let ans_arr = []
        // Evaluate answer
        try {
            let ans = eval(str1)
            if(ans !== true && ans !== false){
                if(is_XOR){  // int bool
                    ans = ans.toString().replace("1","WIN")
                    ans = ans.toString().replace("0","FAIL")
                }
                else{  // integer
                    ans = Math.round(ans*100) / 100
                }
                
            }
            else{   // boolean
                ans = ans.toString().replace(/true/g,"WIN")
                ans = ans.toString().replace(/false/g,"FAIL")
            }
            
            this.state.symbol_table[0][1] = ans.toString()        // IT variable
            // Convert answer to string
            ans_arr.push([ans.toString(),"Literal"])
            if(trails !== []) ans_arr = ans_arr.concat(trails)
            return ans_arr;       
        } catch (e) {
            return null
        }     
    }
    // Solving If-Else commands
    solveCondition(arr,startIndex,endIndex){
        let cond, n
        // Evaluate IT variable
        if(this.state.symbol_table[0][1] === init_value) return null
        if(this.state.symbol_table[0][1] === "WIN") cond = cls.if_key
        else if(this.state.symbol_table[0][1] === "FAIL") cond = cls.else_key
        else return null

        let result = []
        for (let i= (startIndex+1); i < (endIndex+1); i++) {
            // COND is either IF or ELSE Keyword
            if(arr[i][1] === cond){
                n = 1
                while(arr[i+n][1] !== cls.eol){
                    result.push(arr[i+n])
                    n++
                }
                result.push(arr[i+n])
                return result
            }
        }
    }
    // Solve Switch Statements
    solveSwitch(val, arr,startIndex,endIndex){
        let n
        let result = []
        let default_res = []
        if(val === init_value) return null

        for (let i= (startIndex+1); i < (endIndex+1); i++) {
            // Case Keys
            if(arr[i][1] === cls.case_key){
                if(arr[i+1][0] === val){
                    n = 2
                    while(arr[i+n][1] !== cls.break_key){
                        result.push(arr[i+n])
                        n++
                    }
                    result.push(["\n", cls.eol])
                    return result
                }
            }
            // Default key
            if(arr[i][1] === cls.default_key){
                n = 1
                while(arr[i+n][1] !== cls.eol){
                    default_res.push(arr[i+n])
                    n++
                }
                default_res.push(arr[i+n])
            }
        }
        return default_res
    }

    // Find value of IT 
    findIT(arr){
        let name, val
        for (let i = 0; i< arr.length; i++) {
            name = arr[i][1].substring(20,arr[i][1].length)
            val = arr[i][0]
            if ("IT" === name && val !== init_value && val !== "IT"){
                if(val !== "FAIL" && val !== "WIN") return val
            }
        }
        return init_value
    }


    // Solve Loop statements
    solveLoop(arr,startIndex,endIndex){
        
        let n, operator, counter, counter_name, delim, count
        let statements = [["LOOP", cls.loop]]

        operator = arr[startIndex+2][1]
        counter = arr[startIndex+4]
        counter_name = counter[1].substring(20,counter[1].length)
        delim = [arr[startIndex+7][0], arr[startIndex+9][0]]
       
        // Get statements
        for (let i= (startIndex+1); i < (endIndex+1); i++) {
            if(arr[i][1] === cls.eol){
                n = 1
                while(arr[i+n][1] !== cls.end_loop){
                    statements.push(arr[i+n])
                    n++
                }
                break
            }
        }

        // Get count
        let init
        let end = Number(delim[1])
        if(!isNaN(delim[0])) init = Number(delim[0])
        else{
            for (let j = 0; j < this.state.symbol_table.length; j++) {
                if(this.state.symbol_table[j][0] === counter_name){
                    init = Number(this.state.symbol_table[j][1])
                    break
                }
            }
        }
        count = Math.abs(end - init)
        // Execute statements for <count> times
        for (let index = 0; index < count; index++) {
            statements = this.findVariables(statements)
            this.findIO(statements)
            // Increment or Decrement counter
            this.handleCounter(operator, counter_name)
        }
        return ["\n", cls.eol]
    }
    // Increment or Decrement counter
    handleCounter(operator, counter_name){
        for (let j = 0; j < this.state.symbol_table.length; j++) {
            if(this.state.symbol_table[j][0] === counter_name){
                // Increment
                if(operator === cls.increment_op){
                    this.state.symbol_table[j][1] = String(Number(this.state.symbol_table[j][1]) + 1)
                }
                // Decrement
                else if(operator === cls.decrement_op) {
                    this.state.symbol_table[j][1] = String(Number(this.state.symbol_table[j][1]) - 1)
                }
                // Update symbol table
                this.props.func.getSymbols(this.state.symbol_table);
            }
        }
    }    

    /* Find statements */
    findStatements(arr){ 
        let n, newType
        let temp = []
        for (let i = 0; i< arr.length; i++) {
            
            /* Variable assignment */
            if(arr[i][1].match(cls.varident)  && arr[i+1][1].match(cls.variable_assign) && (arr[i+2][1].match(/Literal/) || arr[i+2][1].match(cls.varident))){
                let name = arr[i][1].substring(20,arr[i][1].length)
                let name1 = arr[i+2][1].substring(20,arr[i+2][1].length)
                if(name === 'IT' && arr[i+2][0] !== name1){
                    this.state.symbol_table[0][1] = arr[i+2][0]
                    this.props.func.getSymbols(this.state.symbol_table);
                }
                for (let j = 0; j< this.state.symbol_table.length; j++) {
                    if(this.state.symbol_table[j][0] === arr[i][0] && arr[i+2][0] !== name1){
                        this.state.symbol_table[j][1] = arr[i+2][0]
                        this.props.func.getSymbols(this.state.symbol_table);
                    }                
                }
            }
            /* Variable declaration with expressions as values */
            if(arr[i][1].match(cls.variable_decl)  && arr[i+1][1].match(cls.varident)  && arr[i+2][1].match(cls.variable_init) && arr[i+3][1].match(/Literal/)){
                
                for (let j = 0; j< this.state.symbol_table.length; j++) {
                    if(this.state.symbol_table[j][0] === arr[i+1][0]){
                        this.state.symbol_table[j][1] = arr[i+3][0]
                        this.props.func.getSymbols(this.state.symbol_table);
                    }                
                }
            }

            /* Change variables with evaluated values */
            if(arr[i][1].match(cls.varident)){
                
                let name = arr[i][1].substring(20,arr[i][1].length)
                if(name === 'IT' && this.state.symbol_table[0][1] !== init_value){
                    arr[i][0] = this.state.symbol_table[0][1]
                }
                for (let j = 0; j < this.state.symbol_table.length; j++) {
                    if(this.state.symbol_table[j][0] === arr[i][0] && this.state.symbol_table[j][1] !== init_value){
                        arr[i][0] = this.state.symbol_table[j][1]
                    }
                    // If loop decrement
                    if(this.state.symbol_table[j][0] === name && arr[0][1].match(cls.loop)){
                        arr[i][0] = this.state.symbol_table[j][1]
                    }
                }
            }
            
            /* Type casting Prefix */
            if(arr[i][1] === cls.prefix_typecast){
                n = 0
                while(arr[i+n][1]!==cls.eol) n++;
                n--;
                newType = arr[i+n][0]
                if(arr[i+1][1].match(cls.varident)){
                    let name = arr[i+1][1].substring(20,arr[i+1][1].length)
                    if(name === 'IT' && this.state.symbol_table[0][1] !== init_value){
                        arr[i+1][0] = this.state.symbol_table[0][1]
                    }
                    for (let j = 0; j < this.state.symbol_table.length; j++) {
                        if(this.state.symbol_table[j][0] === name){
                            if(newType === "NUMBAR") this.state.symbol_table[j][1] = String(Number(this.state.symbol_table[j][1]).toFixed(1))
                            else if(newType === "NUMBR")  this.state.symbol_table[j][1] = String(Number(this.state.symbol_table[j][1]).toFixed(0))
                            this.props.func.getSymbols(this.state.symbol_table);
                        }
                    }
                }
            }

            /* Type casting Infix */
            if(arr[i][1] === cls.infix_typecast){
                n = 0
                while(arr[i+n][1]!==cls.eol) n++;
                n--;
                newType = arr[i+n][0]
                if(arr[i-1][1].match(cls.varident)){
                    let name = arr[i-1][1].substring(20,arr[i-1][1].length)
                    if(name === 'IT' && this.state.symbol_table[0][1] !== init_value){
                        arr[i-1][0] = this.state.symbol_table[0][1]
                    }
                    for (let j = 0; j < this.state.symbol_table.length; j++) {
                        if(this.state.symbol_table[j][0] === name){
                            if(newType === "NUMBAR") this.state.symbol_table[j][1] = String(Number(this.state.symbol_table[j][1]).toFixed(1))
                            else if(newType === "NUMBR")  this.state.symbol_table[j][1] = String(Number(this.state.symbol_table[j][1]).toFixed(0))
                            this.props.func.getSymbols(this.state.symbol_table);
                        }
                    }
                }
            }

            /* If-Else */
            if(arr[i][1] === cls.start_cond){
                n = 0
                while(arr[i+n][1]!==cls.end_cond) n++;
                temp = this.solveCondition(arr,i,i+n);
                if(temp !== null){
                    arr.splice(i,n,temp[0]);
                    let j = i + 1;
                    for (let x = 1; x < temp.length; x++) {
                        arr.splice(j,0,temp[x]);   // Replace
                        j++;
                    }
                }
            }
            /* Switch Case */
            if(arr[i][1] === cls.start_switch){
                n = 0
                while(arr[i+n][1]!==cls.end_cond) n++;
                temp = this.solveSwitch(this.findIT(arr),arr,i,i+n);
                if(temp !== null){
                    arr.splice(i,n,temp[0]);
                    let j = i + 1;
                    for (let x = 1; x < temp.length; x++) {
                        arr.splice(j,0,temp[x]);   // Replace
                        j++;
                    }
                }
            }
            /* Loops */   
            if(arr[i][1] === cls.start_loop){
                n = 0
                while(arr[i+n][1]!==cls.end_loop) n++;
                temp = this.solveLoop(arr,i,i+n);
                arr.splice(i,n,temp);
            }     
        }
        return arr
    }

    /* Find output and input operations */
    async findIO(arr){
        let text
        for (let i = 0; i< arr.length; i++) {
            // OUTPUT KEYWORD
            if(arr[i][1].match(cls.output_key)){
                let temp = ""
                let n = 1
                this.setState({text: []})
                while(arr[i+n-1] && arr[i+n-1][1] !== cls.eol){
                    if(arr[i+n] && arr[i+n][1] === cls.eol){
                        this.state.text.push("\n")
                    }
                    else {
                        /* If variable */
                        if(arr[i+n] && arr[i+n][1].match(cls.varident)){
                            
                            let name = arr[i+n][1].substring(20,arr[i+n][1].length)
                            if(name === 'IT' && this.state.symbol_table[0][1] !== init_value){
                                arr[i+n][0] = this.state.symbol_table[0][1]
                            } 
                            for (let j = 0; j < this.state.symbol_table.length; j++) {
                                if(this.state.symbol_table[j][0] === arr[i+n][0] && this.state.symbol_table[j][1] !== init_value){
                                    arr[i+n][0] = this.state.symbol_table[j][1]
                                }
                            }
                        }
                        if(arr[i+n]) this.state.text.push(arr[i+n][0])
                    }
                    if(arr[i+n]) temp += " " + arr[i+n][0]
                    n++
                }
                this.state.symbol_table[0][1] = temp
                text = this.state.text.join(" ")
                text = text.replace(/\n /g,"\n")
                this.props.func1.getText(text); 
            } 
            /* ASK USER INPUT */
            if(arr[i][1].match(cls.input_key)){ 
                document.getElementById("textarea").focus()  // Activate console focus
                // Wait for user input
                let input = await this.props.func2.getInput();
                // Update symbol table
                for (let j = 0; j < this.state.symbol_table.length; j++) {
                    if(this.state.symbol_table[j][0] === arr[i+1][0]){
                        this.state.symbol_table[j][1] = input
                    }
                }
                arr[i+1][0] = input
                this.props.func.getSymbols(this.state.symbol_table);
                let temp = []
                arr = this.findExpressions(arr)
                while(true){
                    temp = this.findExpressions(arr)
                    if(arr !== temp) arr = temp;
                    else break
                }
            }
        }
    }

    render(){
        return(
            <div></div>
        )
    }
}

export default SemanticAnalyzer;