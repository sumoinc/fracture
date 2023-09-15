import { paramCase } from "change-case";
import { Component } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { AttributeType, DynamoAttribute } from "./dynamo-attribute";
import { DynamoGsi, DynamoGsiOptions, DynamoGsiType } from "./dynamo-gsi";

export interface DynamoTableOptions {
  /**
   * Name for the table.
   */
  name: string;
  /**
   * Name to use for PK attribute.
   *
   * @default: "pk"
   */
  pkName?: string;
  /**
   * Name to use for SK attribute.
   *
   * @default: "sk"
   */
  skName?: string;
  /**
   * Name to use for Lookup attribute.
   *
   * @default: "idx"
   */
  idxName?: string;
}

export class DynamoTable extends Component {
  /**
   * Returns the dynamo table for a project or creates one if it
   * doesn't exist yet. Singleton?
   */
  public static of(project: TypeScriptProject): DynamoTable {
    const isDefined = (c: Component): c is DynamoTable =>
      c instanceof DynamoTable;
    return (
      project.components.find(isDefined) ??
      new DynamoTable(project, { name: `${project.name}-table` })
    );
  }

  /**
   * Name for the table.
   */
  public readonly name: string;
  public readonly pk: DynamoAttribute;
  public readonly sk: DynamoAttribute;
  public readonly idx: DynamoAttribute;
  public readonly keyGsi: DynamoGsi;
  public readonly lookupGsi: DynamoGsi;
  public readonly gsi: DynamoGsi[] = [];

  constructor(
    public readonly project: TypeScriptProject,
    options: DynamoTableOptions
  ) {
    super(project);

    /***************************************************************************
     * Props
     **************************************************************************/

    this.name = paramCase(options.name);
    const pkName = options.pkName ?? "pk";
    const skName = options.skName ?? "sk";
    const lookupName = options.idxName ?? "idx";
    this.pk = new DynamoAttribute(project, {
      name: pkName,
      attributeType: AttributeType.STRING,
      keyType: "HASH",
    });
    this.sk = new DynamoAttribute(project, {
      name: skName,
      attributeType: AttributeType.STRING,
      keyType: "RANGE",
    });
    this.idx = new DynamoAttribute(project, {
      name: lookupName,
    });

    /***************************************************************************
     * Build Key GSI
     **************************************************************************/

    this.keyGsi = this.addGsi({
      name: "key",
      pk: this.pk,
      sk: this.sk,
      type: DynamoGsiType.PRIMARY,
    });

    /***************************************************************************
     * Build Lookup GSI
     **************************************************************************/

    this.lookupGsi = this.addGsi({
      name: "loookup",
      pk: this.sk,
      sk: this.idx,
    });

    return this;
  }

  public addGsi(options: DynamoGsiOptions) {
    const gsi = new DynamoGsi(this.project, options);
    this.gsi.push(gsi);
    return gsi;
  }

  /***************************************************************************
   * Configuration export for this table
   **************************************************************************/

  public config(): Record<string, any> {
    return {
      name: this.name,
      pk: this.pk.config(),
      sk: this.sk.config(),
      idx: this.idx.config(),
      keyGsi: this.keyGsi.config(),
      lookupGsi: this.lookupGsi.config(),
      gsi: this.gsi.map((gsi) => gsi.config()),
    };
  }
}
