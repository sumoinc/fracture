import { SourceCode } from 'projen';
import { FractureComponent } from '../../core/component';
import { Fracture } from '../../core/fracture';
import { Entity } from '../../model';


export class VtlResolvers extends FractureComponent {

  constructor(fracture: Fracture) {
    super(fracture);
  }

  public preSynthesize() {
    // generate an array of all the entities in this fracture scope.
    const isEntity = (c: FractureComponent): c is Entity => c instanceof Entity && c.namespace === this.namespace;
    const entities = (this.project.components as FractureComponent[]).filter(isEntity);

    /**
     *  Build a VTL file and make sure it's marked as being managed by projen.
     *
     * @param name
     * @returns {SourceCode]
     */
    const vtlFile = (name: string): SourceCode => {
      const f = new SourceCode(this.project, `${this.fracture.gendir}/api/app-sync/resolvers/vtl/${name}`);
      f.line('## ' + f.marker);
      return f;
    };

    /**
     * Build create resolver for entity.
     */
    const createItemResolver = (e: Entity) => {
      const requestResolver = vtlFile(`/Mutation.create-${e.name}.request.vtl`);
      requestResolver.line('{}');
      const responseResolver = vtlFile(`/Mutation.create-${e.name}.response.vtl`);
      responseResolver.line('$util.toJson($ctx.result)');
    };

    /**
     * Build read resolver for entity.
     */
    const readItemResolver = (e: Entity) => {
      const requestResolver = vtlFile(`/Query.read-${e.name}.request.vtl`);
      requestResolver.line('{}');
      const responseResolver = vtlFile(`/Query.read-${e.name}.response.vtl`);
      responseResolver.line('$util.toJson($ctx.result)');
    };

    /**
     * Build update resolver for entity.
     */
    const updateItemResolver = (e: Entity) => {
      const requestResolver = vtlFile(`/Mutation.update-${e.name}.request.vtl`);
      requestResolver.line('{}');
      const responseResolver = vtlFile(`/Mutation.update-${e.name}.response.vtl`);
      responseResolver.line('$util.toJson($ctx.result)');
    };

    /**
     * Build delete resolver for entity.
     */
    const deleteItemResolver = (e: Entity) => {
      const requestResolver = vtlFile(`/Mutation.delete-${e.name}.request.vtl`);
      requestResolver.line('{}');
      const responseResolver = vtlFile(`/Mutation.delete-${e.name}.response.vtl`);
      responseResolver.line('$util.toJson($ctx.result)');
    };


    entities.forEach(e => {

      // build CRUD resolvers
      createItemResolver(e);
      readItemResolver(e);
      updateItemResolver(e);
      deleteItemResolver(e);

    });
  }

}

