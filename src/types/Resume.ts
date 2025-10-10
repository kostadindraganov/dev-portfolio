
export enum SyntaxType {
  Keyword = 'keyword',
  Variable = 'variable',
  String = 'string',
  Comment = 'comment',
  Default = 'default',
  Operator = 'operator',
  Function = 'function',
  Property = 'property',
  Punctuation = 'punctuation',
  TypeName = 'typeName',
  Boolean = 'boolean',
  Number = 'number',
}

export interface CodePart {
  text: string;
  type: SyntaxType;
  href?: string;
}