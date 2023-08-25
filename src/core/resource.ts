import { join } from "path";
import { paramCase } from "change-case";
import { Component } from "projen";
import { FractureService } from "./fracture-service";
import { Operation, OperationOptions } from "./operation";
import {
  IdentifierType,
  ManagementType,
  ResourceAttribute,
  ResourceAttributeGenerator,
  ResourceAttributeOptions,
  VisabilityType,
} from "./resource-attribute";
import { Structure, StructureOptions } from "./structure";
import { TypescriptCommand } from "../generators/ts/command";
import { TypescriptLambdaApiGatewayConstruct } from "../generators/ts/lambda-api-gateway-construct";
import { TypescriptLambdaApiGatewayHandler } from "../generators/ts/lambda-api-gateway-handler";
import { TypescriptLambdaAppsyncConstruct } from "../generators/ts/lambda-appsync-construct";
import { TypescriptLambdaAppsyncHandler } from "../generators/ts/lambda-appsync-handler";
import { TypescriptStrategy } from "../generators/ts/strategy";

export interface ResourceOptions {
  /**
   *  Name for the Resource.
   */
  name: string;
  /**
   * Short name for the Resource.
   */
  shortName?: string;
  /**
   * Plural name for the Resource.
   */
  pluralName?: string;
  /**
   * Comment lines to add to the Resource.
   * @default []
   */
  comments?: string[];
  /**
   * Options for attributes to add when initializing the resource.
   */
  attributeOptions?: ResourceAttributeOptions[];
}

export class Resource extends Component {
  /**
   *  Name for the Resource.
   */
  public readonly name: string;
  /**
   * Short name for the Resource.
   */
  public readonly shortName: string;
  /**
   * Plural name for the Resource.
   */
  public readonly pluralName: string;
  /**
   * Comment lines to add to the Resource.
   *
   * @default []
   */
  public comments: string[];

  /**
   * Primary key for this resource.
   */
  public pk: ResourceAttribute;
  /**
   * Sort key for this resource.
   */
  public sk: ResourceAttribute;
  /**
   * Lookup key for this resource.
   */
  public idx: ResourceAttribute;
  /**
   * Id key for this resource.
   */
  public id: ResourceAttribute;
  public type: ResourceAttribute;
  public version: ResourceAttribute;
  public dateCreated: ResourceAttribute;
  public dateModified: ResourceAttribute;
  public dateDeleted: ResourceAttribute;
  /**
   * All attributes in this resource.
   */
  public attributes: ResourceAttribute[] = [];
  /**
   * Public facing data structure using full attributes names.
   * Excludes hidden attributes.
   */
  public publicDataStructure: Structure;
  /**
   * Entire private data structure using shortnames.
   * Includes all attributes, including hidden ones.
   * This data shape is that unmarchalled data in dynamo looks like and can be
   * used within internal messaging like SQS and EventBus.
   */
  public privateDataStructure: Structure;
  /**
   * All structures for this resource.
   */
  public structures: Structure[] = [];
  public createOperation: Operation;
  public readOperation: Operation;
  public updateOperation: Operation;
  public deleteOperation: Operation;
  /**
   * All operations for this resource.
   */
  public operations: Operation[] = [];

  constructor(service: FractureService, options: ResourceOptions) {
    super(service);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = paramCase(options.name);
    this.shortName = options.shortName
      ? paramCase(options.shortName)
      : this.name;
    this.pluralName = options.pluralName
      ? paramCase(options.pluralName)
      : options.name + "s";
    this.comments = options.comments ?? [];

    /***************************************************************************
     * Initialize data structures
     **************************************************************************/

    this.publicDataStructure = this.addStructure({
      name: `${this.name}-data`,
    });

    this.privateDataStructure = this.addStructure({
      name: `internal-${this.name}-data`,
    });

    /***************************************************************************
     * Operations
     **************************************************************************/

    // Create
    this.createOperation = this.addOperation({
      name: `create-${this.name}`,
      dynamoGsi: service.dynamoTable.keyGsi,
    });

    // Read
    this.readOperation = this.addOperation({
      name: `get-${this.name}`,
      dynamoGsi: service.dynamoTable.keyGsi,
    });

    // Update
    this.updateOperation = this.addOperation({
      name: `update-${this.name}`,
      dynamoGsi: service.dynamoTable.keyGsi,
    });

    // Delete
    this.deleteOperation = this.addOperation({
      name: `delete-${this.name}`,
      dynamoGsi: service.dynamoTable.keyGsi,
    });

    /***************************************************************************
     * PArtition and Sort Key
     **************************************************************************/

    this.pk = this.addAttribute({
      name: service.dynamoTable.pk.name,
      comments: [`Partition Key for this record.`],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.HIDDEN,
      generator: ResourceAttributeGenerator.COMPOSITION,
    });
    this.sk = this.addAttribute({
      name: service.dynamoTable.sk.name,
      comments: [`Sort Key for this record.`],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.HIDDEN,
      generator: ResourceAttributeGenerator.COMPOSITION,
    });

    /***************************************************************************
     * Lookup Access Pattern
     **************************************************************************/

    this.idx = this.addAttribute({
      name: service.dynamoTable.idx.name,
      comments: [`Lookup value for this record.`],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.HIDDEN,
      generator: ResourceAttributeGenerator.COMPOSITION,
      compositionsSeperator: " ",
    });

    /***************************************************************************
     * Identifier Attribute
     **************************************************************************/

    this.id = this.addAttribute({
      name: "id",
      comments: [`Identifier for this record.`],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.USER_VISIBLE,
      identifier: IdentifierType.PRIMARY,
      createGenerator: ResourceAttributeGenerator.GUID,
    });
    this.sk.addCompositionSource(this.id);

    /***************************************************************************
     * Type Attribute
     **************************************************************************/

    this.type = this.addAttribute({
      name: "type",
      shortName: "t",
      comments: [`Type of record.`],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.USER_VISIBLE,
      createGenerator: ResourceAttributeGenerator.TYPE,
    });
    this.sk.addCompositionSource(this.type);

    /***************************************************************************
     * Version Attribute
     **************************************************************************/

    this.version = this.addAttribute({
      name: "version",
      shortName: "v",
      comments: [`Version for record.`],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.USER_VISIBLE,
      createGenerator: ResourceAttributeGenerator.VERSION_DATE_TIME_STAMP,
    });
    this.sk.addCompositionSource(this.version);

    /***************************************************************************
     * Audit Dates
     **************************************************************************/

    this.dateCreated = this.addAttribute({
      name: "created-timestamp",
      shortName: "ct",
      comments: [`The timestamp representing when this record was created.`],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.USER_VISIBLE,
      createGenerator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
      updateGenerator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });
    this.dateModified = this.addAttribute({
      name: "modified-timestamp",
      shortName: "mt",
      comments: [
        `The timestamp representing when this record was last modified.`,
      ],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.USER_VISIBLE,
      updateGenerator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });
    this.dateDeleted = this.addAttribute({
      name: "deleted-timestamp",
      shortName: "dt",
      comments: [
        `The timestamp representing when this record was marked as deleted.`,
      ],
      management: ManagementType.SYSTEM_MANAGED,
      visibility: VisabilityType.HIDDEN,
      deleteGenerator: ResourceAttributeGenerator.CURRENT_DATE_TIME_STAMP,
    });

    /***************************************************************************
     * Attributes based on options
     **************************************************************************/

    if (options.attributeOptions) {
      options.attributeOptions.forEach((attributeOption) => {
        this.addAttribute(attributeOption);
      });
    }
    return this;
  }

  /**
   * Adds an attribute to this resource.
   * Also manages some data structures used in code generation.
   */
  public addAttribute(options: ResourceAttributeOptions) {
    const service = this.project as FractureService;
    const attribute = new ResourceAttribute(service, options);
    this.attributes.push(attribute);

    return attribute;
  }

  public addStructure(options: StructureOptions) {
    const service = this.project as FractureService;
    const structure = new Structure(service, options);
    this.structures.push(structure);
    return structure;
  }

  public addOperation(options: OperationOptions) {
    const service = this.project as FractureService;
    const operation = new Operation(service, options);
    this.operations.push(operation);
    return operation;
  }

  /*****************************************************************************
   *
   * Pre-synth
   *
   * We should have all our operations and attributes added now so it's safe to
   * start looping over them and preparing for codegen.
   *
   ****************************************************************************/
  preSynthesize(): void {
    super.preSynthesize();

    const service = this.project as FractureService;

    /***************************************************************************
     * Loop attributes & build data structures
     **************************************************************************/

    this.attributes.forEach((attribute) => {
      /***************************************************************************
       * Update data structures
       **************************************************************************/

      // if user visible, add to public data structure
      if (attribute.visibility === VisabilityType.USER_VISIBLE) {
        this.publicDataStructure.addAttribute({
          name: attribute.name,
          type: attribute.type,
          comments: attribute.comments,
          required: true,
        });
      }

      // everything goes into private data structure
      this.privateDataStructure.addAttribute({
        name: attribute.shortName,
        type: attribute.type,
        comments: attribute.comments,
        required: true,
      });

      /***************************************************************************
       * Operation inputs / outputs
       **************************************************************************/

      // if user visible it might be an input or output
      if (attribute.visibility === VisabilityType.USER_VISIBLE) {
        // all outputs get everything visible
        this.createOperation.outputStructure.addAttribute({
          name: attribute.name,
          type: attribute.type,
          comments: attribute.comments,
          required: true,
        });
        this.readOperation.outputStructure.addAttribute({
          name: attribute.name,
          type: attribute.type,
          comments: attribute.comments,
          required: true,
        });
        this.updateOperation.outputStructure.addAttribute({
          name: attribute.name,
          type: attribute.type,
          comments: attribute.comments,
          required: true,
        });
        this.deleteOperation.outputStructure.addAttribute({
          name: attribute.name,
          type: attribute.type,
          comments: attribute.comments,
          required: true,
        });

        // create / update / delete need identifiers
        if (attribute.identifier === IdentifierType.PRIMARY) {
          this.readOperation.inputStructure.addAttribute({
            name: attribute.name,
            type: attribute.type,
            comments: attribute.comments,
            required: true,
          });
          this.updateOperation.inputStructure.addAttribute({
            name: attribute.name,
            type: attribute.type,
            comments: attribute.comments,
            required: true,
          });
          this.deleteOperation.inputStructure.addAttribute({
            name: attribute.name,
            type: attribute.type,
            comments: attribute.comments,
            required: true,
          });
        }

        // create/update get all user managed
        if (attribute.management === ManagementType.USER_MANAGED) {
          this.createOperation.inputStructure.addAttribute({
            name: attribute.name,
            type: attribute.type,
            comments: attribute.comments,
            required: true,
          });
          this.updateOperation.inputStructure.addAttribute({
            name: attribute.name,
            type: attribute.type,
            comments: attribute.comments,
            required: true,
          });
        }
      }
    }); // and loop attributes

    /***************************************************************************
     * Typescript Generators
     **************************************************************************/

    const strategy = TypescriptStrategy.of(service);

    if (!strategy) {
      throw new Error(`No TypescriptStrategy defined at the service level.`);
    }

    // paths
    const comamndRoot = join("generated", "ts", "commands");
    const apiGatewayRoot = join("generated", "ts", "lambda", "apigw");
    const appsyncRoot = join("generated", "ts", "lambda", "appsync");

    this.operations.forEach((operation) => {
      const format = (suffix: string) => {
        const base = strategy.formatFileName(`${operation.name}-${suffix}`);
        return `${base}.ts`;
      };

      // command
      new TypescriptCommand(service, join(comamndRoot, format("command")), {
        operation,
      });

      // api gateway support
      new TypescriptLambdaApiGatewayConstruct(
        service,
        join(apiGatewayRoot, format("")),
        {
          operation,
        }
      );
      new TypescriptLambdaApiGatewayHandler(
        service,
        join(apiGatewayRoot, "handlers", format("")),
        {
          operation,
        }
      );

      // appsync support
      new TypescriptLambdaAppsyncConstruct(
        service,
        join(appsyncRoot, format("")),
        {
          operation,
        }
      );
      new TypescriptLambdaAppsyncHandler(
        service,
        join(appsyncRoot, "handlers", format("")),
        {
          operation,
        }
      );
    });
  }
}
