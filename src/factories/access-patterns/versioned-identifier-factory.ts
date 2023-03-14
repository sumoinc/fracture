import { IdentifierFactory } from "./identifier-factory";
import { Resource } from "../../core/resource";
import {
  ResourceAttributeGenerator,
  ResourceAttributeType,
} from "../../core/resource-attribute";

export class VersionedIdentifierFactory extends IdentifierFactory {
  constructor(resource: Resource) {
    super(resource);

    /***************************************************************************
     *
     * ATTRIBUTES
     *
     * Add version as resource attribute.
     *
     **************************************************************************/

    const versionAttribute = resource.addResourceAttribute({
      name: "version",
      shortName: "v",
      comments: [`The version of this record`, `@default "LATEST"`],
      type: ResourceAttributeType.STRING,
      isRequired: true,
      isSkComponent: true,
      generator: ResourceAttributeGenerator.VERSION_DATE_TIME_STAMP,
      isGeneratedOnCreate: true,
      isGeneratedOnRead: true,
      isGeneratedOnUpdate: true,
      isGeneratedOnDelete: true,
      createDefault: "LATEST",
      updateDefault: "LATEST",
      deleteDefault: "DELETED",
    });
    this.accessPattern.addSkAttributeSource(versionAttribute);

    return this;
  }
}
