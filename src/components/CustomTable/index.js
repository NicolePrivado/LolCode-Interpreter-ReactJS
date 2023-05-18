import React from 'react';
import styles from './CustomTable.module.css';

import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
} from '@chakra-ui/react';

class CustomTable extends React.Component {

	constructor(props){
		super(props)
		this.state = {

		}
	}

	render(){
		const header1 = this.props.header[0];
		const header2 = this.props.header[1];
		const table = this.props.table;

		// use JSON.stringify(data) pass this props as JSON object
		// just rename lexeme to key and description to value

		// const data = JSON.stringify(data)

		return (
			<div className={styles.baseStyles}>
				<h3 className={styles.h3}>{table}</h3>
				<div className={styles.tableWrapper}>
					
					<Table 
						variant='striped' 
						colorScheme='cyan'
						size='sm' 
						className={styles.table}>
						<Thead>
						<Tr>
							<Th>{header1}</Th>
							<Th>{header2}</Th>
						</Tr>
						</Thead>
						<Tbody>
							{ this.props.data !== [] ?
							(this.props.data).map((item,index) => {
								if (item[1] !== "New line"){
									return(
										<Tr key = {index}>
											{/* and access it as item.key and item.description */}
											{/* <Td>{item.key}</Td>
											<Td>{item.value}</Td> */}
											<Td>{item[0]}</Td>
											<Td>{item[1].match("Variable Identifier") ? item[1].slice(0,19): item[1]}</Td>
										</Tr>
									)	
								}
								return true
							}) : ''} 
						</Tbody>
					</Table>
				</div>
			</div>
		)
	}

}

export default CustomTable