import fs from "node:fs/promises";
import dotenv from "dotenv";
dotenv.config();
import { Document, MetadataMode, VectorStoreIndex } from "llamaindex";

async function main() {
  const path = "article.txt";

  const article = await fs.readFile(path, "utf-8");

  const document = new Document({ text: article, id_: path });

  const index = await VectorStoreIndex.fromDocuments([document]);

  const queryEngine = index.asQueryEngine();

  const { response, sourceNodes } = await queryEngine.query({
    query: "What is this article about?",
  });

  console.log(response);

  if (sourceNodes) {
    sourseNodes.forEach((source, index) => {
      console.log(
        `\n${index}: Score: ${source.score} - ${source.node
          .getContent(MetadataMode.NONE)
          .substring(0, 50)}...\n`
      );
    });
  }
}

main().catch(console.error);
