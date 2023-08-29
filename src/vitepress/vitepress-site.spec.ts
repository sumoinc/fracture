import { readFile } from "fs/promises";
import { join } from "path";
import axios from "axios";
import { filesToScaffold } from "./vitepress-site";

/**
 * This is probably a terrible check but maknig sure that none of the source
 * templates changes on github.
 **/
test("Check for remote changes", async () => {
  const projectRoot = "https://raw.githubusercontent.com/vuejs/vitepress/main/";
  expect(projectRoot).toBeTruthy();
  expect(filesToScaffold).toBeTruthy();

  await Promise.all(
    filesToScaffold.map(async (file) => {
      const remoteFile = projectRoot + file;
      const localPath = join(__dirname, file);
      const content = await readFile(localPath, "utf8");
      const { data } = await axios.get(remoteFile);

      expect(data).toEqual(content);
    })
  );
});
