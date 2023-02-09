import { Component, Project } from 'projen';

export class FractureComponent extends Component {
  public readonly namespace: string;

  constructor(
    project: Project,
    namespace: string,
  ) {
    super(project);

    this.namespace = namespace;
  }

}
