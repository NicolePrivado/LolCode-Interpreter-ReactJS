import React from 'react';
import ReactDOM from 'react-dom';

import { 
    Input,
} from '@chakra-ui/react'
import { Textarea } from "@chakra-ui/react";
import styles from "./TextEditor.module.css";

import LexicalAnalyzer from '../LexicalAnalyzer';

class TextEditor extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            fileContent: null,
            lexicalOutput: [],
            isRun: false       
        }

        this.handleFileChange = this.handleFileChange.bind(this);
        this.run = this.run.bind(this);
        this.getLexicalOutput = this.getLexicalOutput.bind(this);
    }

    componentDidUpdate(prevProps,prevState){

        //this will trigger whenever run button is clicked
        //this will render/mount the div the will hold the <lexicalAnalyzer>
        
        if((prevState.fileContent !== this.state.fileContent) || this.state.isRun === true){
            
            const lexicalanalyzer = document.getElementById('lexicalanalyzer');
            ReactDOM.render(<LexicalAnalyzer str={this.state.fileContent} data={{getLexicalOutput: this.getLexicalOutput.bind(this)}}/>, lexicalanalyzer);
            document.getElementById("textarea").value = ""
            this.props.func.resetConsole()
            this.setState({isRun: false})
        }
        
        if(prevState.lexicalOutput !== this.state.lexicalOutput){
            this.props.data.getLexicalOutput(this.state.lexicalOutput);
        }
    }

    getLexicalOutput(output){
        this.setState({lexicalOutput: output});
    }

    handleFileChange(e) {

        //try catch in the event that no file is selected
        try{
            e.preventDefault()
            
            const reader = new FileReader()
            reader.onload = async (e) => { 
            let text = (e.target.result)
            document.getElementById("editor").value=text;
            document.getElementById("textarea").value = ""
            this.props.func.resetConsole()
        };
        reader.readAsText(e.target.files[0])
        }catch{
            //do nothing when no file was selected
            
        }
    }

    handleInputChange(e) {
        // when user changes the state of the text area
    }

    removeFile(e){                  //when you click choose file, value will be set to null 
        e.target.value = null;      //so in the case you input the same file again, it will work
    }

    run(){
        
        //unmounting the div that will contain the <lexicalAnalyzer>
        
        const lexicalanalyzer = document.getElementById('lexicalanalyzer');
        ReactDOM.unmountComponentAtNode(lexicalanalyzer);
        
        this.setState({isRun: true})

        //setting the state of the filecontent that will trigger componentDidUpdate that will render <lexicalAnalyzer str={this.state.fileContent}>
        let text = document.getElementById("editor").value;
        
        this.setState({ fileContent: text });
    }

    render() {
        return(
            <div className={styles.containter}>
                <div>
                    <Input   
                        className={`button-text ${styles.inputFile}`}
                        variant='flushed'
                        colorScheme='teal'
                        size='md'
                        type="file" 
                        id= "file-selector" 
                        accept=".lol"   
                        onChange={this.handleFileChange}
                        onClick={this.removeFile}  
                    />
                </div>

                {/* <textarea id="editor" rows = "20" cols = "75"/> */}
                <div className={styles.baseStyles}>
                    <h3>TEXT EDITOR</h3>
                    <Textarea
                        minHeight={480}
                        variant='filled'
                        className={`input-text ${styles.textArea}`}
                        id="editor"
                        // value={value}
                        focusBorderColor = "teal"  
                        onChange={this.handleInputChange}
                        size="sm"
                    />
                </div>
                <button onClick={this.run} className={`button-text ${styles.buttonBaseStyles}`}>
                    Run
                </button>

                <div id='lexicalanalyzer'></div>
            </div>
        )
    }

}

export default TextEditor