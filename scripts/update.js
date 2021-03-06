const axios = require('axios');
const fs = require('fs-extra'); 

(async () => {
  const res = await axios.get("http://schemastore.org/api/json/catalog.json");
  const schemas = res.data.schemas;
  const pkg = await fs.readJson("./package.json");

  const flattenSchemas = [];
  const activationEvents = [];

  for (const schema of schemas) {
    for (const fileMatch of schema.fileMatch || []) {
      flattenSchemas.push({
        fileMatch,
        url: schema.url
      });
      activationEvents.push(`workspaceContains:${fileMatch}`);
    }
  }

  pkg.contributes.jsonValidation = flattenSchemas;
  pkg.activationEvents = activationEvents;
  await fs.writeJson("./package.json", pkg, { spaces: 2 });
})().catch(err => {
  console.error(err);
});
