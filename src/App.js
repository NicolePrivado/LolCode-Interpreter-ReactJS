import "./normalize.css";
import "./typography.css";
import styles from "./App.module.css"
import TextEditor from "./components/TextEditor";
import CustomTable from "./components/CustomTable"
import Console from "./components/Console";
import SyntaxAnalyzer from './components/SyntaxAnalyzer';

import React from 'react';
import ReactDOM from 'react-dom';

export default class App extends React.Component{

  constructor() {
    super();
    this.state = {
        lexemes: [],
        identifiers: [],
        symbols: [],
        text: "",
        error: "",
        input: ""
    }
    this.getLexicalOutput.bind(this);
    this.getSemanticOutput.bind(this);
    this.getSyntaxError.bind(this);
    this.getText.bind(this);
    this.getInput.bind(this);
    this.setInput.bind(this);
  }

  componentDidUpdate(pP, pS){
    if(pS.lexemes !== this.state.lexemes && this.state.lexemes.length !== 0){
      const syntaxanalyzer = document.getElementById('syntaxanalyzer'); 
      ReactDOM.render(<SyntaxAnalyzer lexemes={this.state.lexemes} identifiers ={this.state.identifiers} data={{getSyntaxError: this.getSyntaxError.bind(this)}} func={{getSemanticOutput: this.getSemanticOutput.bind(this)}} func1 = {{getText: this.getText.bind(this)}} func2 = {{getInput: this.getInput.bind(this)}}/>, syntaxanalyzer);
    }
  }
  
  getLexicalOutput(output){
    const syntaxanalyzer = document.getElementById('syntaxanalyzer');
    ReactDOM.unmountComponentAtNode(syntaxanalyzer);
    this.setState({lexemes: output[0], identifiers:output[1]});
  }

  getSemanticOutput(output){
    this.setState({symbols: output});
  }

  getSyntaxError(error){
    this.setState({error: error});
  }

  getText(text){
    this.setState({text: text});
  }

  resetConsole(){
    this.setState({text: ""});
    this.setState({lexemes: []});
    this.setState({symbols: []});
  }

  setInput(input){
    this.setState({input:input});
  }

  async getInput(){
    while(this.state.input === ""){
      await new Promise(r => setTimeout(r, 100));
    }
    let input1 = this.state.input;
    this.setState({ input: "" })
    return input1; 
  }

  render(){
    return (
      <div className="App">
  
        <div className={styles.header}>
          <h2>LolCode Interpreter</h2>
        </div>
  
        <div className={styles.container}>
  
          <div className={styles.textEditor}>
            <TextEditor data={{getLexicalOutput: this.getLexicalOutput.bind(this)}} func={{resetConsole: this.resetConsole.bind(this)}} />
          </div>
  
          <div className={styles.right}>
            <div className={styles.tables}>
              <div className={styles.table}>
                <CustomTable data={this.state.lexemes} table={"LEXEMES"} header={["LEXEME", "CLASSIFICATION"]}/>
              </div>
              <div className={styles.table}>
                <CustomTable data= {this.state.symbols} table={"SYMBOL TABLE"} header={["IDENTIFIER", "VALUE"]}/>
              </div>
            </div>
  
            <div id="console" className={styles.console}>
              {this.state.error === "" ? 
                <Console data={this.state.text} func = {{setInput: this.setInput.bind(this)}}/>
                : <Console data={this.state.error}/>
              }
            </div>

            <div id='syntaxanalyzer'></div> {/*div that will hold the <syntaxAnalyzer>*/}
            <div id='semanticanalyzer'></div> {/*div that will hold the <semanticAnalyzer>*/}
          </div>

        </div>
  
      </div>
    );
  } 
}
