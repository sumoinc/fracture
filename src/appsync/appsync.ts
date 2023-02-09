import { Project } from 'projen';
import { Vtl } from './vtl';
import { FractureComponent } from '../component';

export interface AppSyncOptions {
  /**
   * Directory where generated code will be placed.
   */
  gendir: string;
}

export class AppSync extends FractureComponent {
  public readonly gendir: string;

  constructor(project: Project, namespace: string, options: AppSyncOptions) {
    super(project, namespace);

    this.gendir = options.gendir + '/appsync';

    new Vtl(project, namespace, { gendir: this.gendir });
  }
}

