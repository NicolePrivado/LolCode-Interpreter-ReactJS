import React from 'react';
import { Textarea } from "@chakra-ui/react";
import styles from "./Console.module.css";


class Console extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
      }

    componentDidMount(){
        document.getElementById('textarea').value = this.props.data
    }  

    componentDidUpdate(prevProps){
        
        if(prevProps.data !== this.props.data){
            document.getElementById('textarea').value = document.getElementById('textarea').value + this.props.data
        }
    }

    consoleInput(e){
        let str = e.target.value
        let end = str.length-1
        let endchar = str[end]
        if(endchar === "\n"){
            let i = end-1
            while(str[i] !== "\n") i--
            this.props.func.setInput(str.substring(i+1,end))
        } 
    }
    
    render() {
    
        return (
            <div className={styles.baseStyles}>
                <h3>CONSOLE</h3>
                <Textarea 
                    id="textarea"
                    className={`input-text ${styles.textArea}`} 
                    size="sm"
                    minHeight={232}
                    variant='filled' 
                    focusBorderColor = "teal" 
                    onChange={(e) => this.consoleInput(e)}  
                />
            </div>
        )
    }
}

export default Console