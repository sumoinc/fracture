import { Component } from "projen";
import { DataService } from "./data-service";
import { Resource } from "./resource";
import { ResourceAttributeType } from "./resource-attribute";
import { DynamoGsi } from "../dynamodb";

export interface ResourceHierarchyOptions {
  /**
   *  The GSI to use when storing this hierarchy.
   */
  readonly gsi: DynamoGsi;

  /**
   * Hierarchy members, in order from root to leaf.
   */
  readonly members: Array<Resource>;
}

export class ResourceHierarchy extends Component {
  /**
   *  The GSI to use when storing this hierarchy.
   */
  readonly gsi: DynamoGsi;

  /**
   * Hierarchy members, in order from root to leaf.
   */
  public readonly members: Array<Resource>;

  constructor(
    public readonly project: DataService,
    options: ResourceHierarchyOptions
  ) {
    super(project);

    this.gsi = options.gsi;
    this.members = options.members;

    const grandParents: Array<Resource> = [];

    this.members.forEach((member, idx) => {
      const parent = idx === 0 ? undefined : this.members[idx - 1];
      const child =
        idx === this.members.length - 1 ? undefined : this.members[idx + 1];

      // add parent / grandparents
      if (parent) {
        grandParents.push(parent);

        grandParents.forEach((grandParent) => {
          member.addAttribute({
            name: grandParent.name,
            shortName: grandParent.shortName,
            type: grandParent,
          });
        });
      }

      // define child
      if (child) {
        member.addAttribute({
          name: `${child.pluralName}`,
          shortName: `${child.shortName}s`,
          type: ResourceAttributeType.ARRAY,
          typeParameter: child,
        });
      }
    });

    return this;
  }
}
