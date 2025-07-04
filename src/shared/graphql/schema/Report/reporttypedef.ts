export const reporttypedef = `
type Mutation {
  reportAccount(input: ReportAccountInput!): Boolean!
}

input ReportAccountInput {
  type: String!
  name: String!
  reason: String!
  description: String!
}`
    

