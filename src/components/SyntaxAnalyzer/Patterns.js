import * as cls from '../LexicalAnalyzer/Classifications'

/* Base patterns */
export const linebreak =  "(New line_?)+"
export const variable = "variable[0-9]*"
export const expression = "(expression|variable[0-9]*)"
export const statement = "statement"

/* Operations */
export const loop_operation = "(".concat([cls.increment_op, cls.decrement_op].join("|"),")")
export const binary_operations = "(".concat([cls.addition_op,cls.subtraction_op,cls.multiplication_op,cls.division_op,cls.modulo_op,cls.greater_than,cls.less_than,cls.equal_op,cls.not_equal_op,cls.and_op,cls.or_op,cls.xor_op].join("|"),")")
export const unary_operation = [cls.not_op]
export const operations_unary = [unary_operation,expression].join("_")
export const operations_binary = [binary_operations,expression,cls.separator,expression].join("_")
export const operations = new RegExp([operations_unary,operations_binary].join("|"),"g")
var temp = "("+expression+"_"+cls.separator+"_)+"+expression+"(_"+cls.end_statement+")?"
export const inf_and = new RegExp([cls.infinite_and,temp].join("_"),"g")
export const inf_or = new RegExp([cls.infinite_or,temp].join("_"),"g")

/* IO */
export const input =  new RegExp([cls.input_key,variable].join("_"),"g")
temp = "("+expression+"_)+"
export const output = new RegExp([cls.output_key,temp].join("_"),"g")

/* Comments */
export const comment1 = [cls.comment_unary,cls.comment_content].join("_").concat("_?")
export const comment2 = [cls.comment_unary,cls.comment_content].join("_").concat("_?")
export const comment3 =  [cls.start_comment,cls.comment_content,cls.end_comment].join("_").concat("_?")
export const comment = new RegExp([comment1,comment2,comment3].join("|"),"g")

/* Typecasting */
export const typecast1 = [cls.prefix_typecast,variable,cls.type_assign,cls.type].join("_")
export const typecast2 = [cls.prefix_typecast,variable,cls.type].join("_")
export const typecast3 = [variable,cls.infix_typecast,cls.type].join("_")
export const typecast4 = [variable,cls.variable_assign,cls.prefix_typecast,variable,cls.type].join("_")
export const typecast5 = [variable,cls.variable_assign,cls.prefix_typecast,variable,cls.type_assign,cls.type].join("_")
export const typecast = new RegExp([typecast1,typecast2,typecast3,typecast4,typecast5].join("|"),"g")

/* Literals */
export const strings = [cls.start_string,cls.string,cls.end_string].join("_")
export const literal_arr = [strings,cls.integer_literal,cls.float_literal,cls.boolean_literal]
export const literal = new RegExp(literal_arr.join("|"),"g")

/* If statements */
export const if_block_noElse = [cls.start_cond,linebreak,cls.if_key,linebreak,statement,linebreak,cls.end_cond].join("_")
export const if_block_withElse = [cls.start_cond,linebreak,cls.if_key,linebreak,statement,linebreak,cls.else_key,linebreak,statement,linebreak,cls.end_cond].join("_")
export const if_block = new RegExp([if_block_withElse,if_block_noElse].join("|"), "g")

/* Switch statements */
export const switch_value = new RegExp([cls.case_key,"(".concat(literal_arr.join("|"),")")].join("_"),"g")
export const switch_ending = "(".concat(linebreak,"_",cls.break_key,"_",linebreak,"|",linebreak,")")
export const switch_case = "(".concat(["caseLiteral",linebreak,statement,switch_ending].join("_"),")+")
export const switch_cases = new RegExp(switch_case,"g")
export const default_case = new RegExp([cls.default_key,linebreak,statement,switch_ending].join("_"),"g")
export const switch_block1 = [cls.start_switch,linebreak,"cases",cls.end_cond].join("_")
export const switch_block2 = [cls.start_switch,linebreak,"cases","default",cls.end_cond].join("_")
export const switch_block = new RegExp([switch_block2,switch_block1].join("|"), "g")

/* Loop statements */
export const loop_expr = new RegExp([cls.loop_cond,expression].join("_"),"g")
export const loop_statement = "(statement|Break Keyword_?)+"
export const loop = [cls.start_loop,variable,loop_operation,cls.loop_testvar,variable,"loopExpr",linebreak,loop_statement,linebreak,cls.end_loop,variable].join("_")
export const loop_block = new RegExp(loop,"g")

/* Variables */
export const assignment = new RegExp([variable,cls.variable_assign,expression ].join("_"),"g")
export const declaration_noInit = [cls.variable_decl,variable].join("_")
export const declaration_withInit = [declaration_noInit,cls.variable_init,expression].join("_")
export const declaration = new RegExp([declaration_withInit,declaration_noInit].join("|"),"g")
export const vars = /Variable Identifier/g

/* Statements */
export const statement1 = /input|output|expression|comment|assignment|declaration|typecast/g
export const statement2 = /statement_(New line_)+/g
export const statement3 = /(statement[0-9]*_)+/g

/* Program */
export const program1 = [linebreak,statement,linebreak].join("_")
export const program = new RegExp(program1, "g")