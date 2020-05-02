# mesh

Zettelkasten

## Setup

### API

1. Install [Neo4j](https://neo4j.com/download/). Create a project called "Mesh," install the APOC plugin and take note of the username and password
2. `cd api && cp config.json.sample config.json` and fill in the username and password of the Neo4j database you just created into the `config.json` fields
3. `cd api/ && npm run dev` You should now be able to go to `http://localhost:4000/graphql` to make some graphql queries. See the `api/src/__fixtures__/` folder for example queries and mutations

## Resources

### Neo4j and Cypher

- https://neo4j.com/developer/kb/understanding-cypher-cardinality/

## Technology to Try

### Client

- https://gqless.dev/
- ProseMirror and Remirror
  - https://discuss.prosemirror.net/t/using-with-react/904/18
  - https://bitbucket.org/atlassian/atlaskit-mk-2/src/0fcae893b790443a30f7dadae00638d6e4238b2f/packages/editor/editor-core/src/ui/PortalProvider/index.tsx?at=master
  - https://github.com/remirror/remirror
