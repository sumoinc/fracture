import { Component, Project } from 'projen';
import { Fracture } from '../src/fracture';

export class ExampleApp extends Component {

  constructor(
    project: Project,
  ) {
    super(project);

    const fracture = new Fracture(project, 'foo', { gendir: 'example' });

    fracture.addEntity({ name: 'user' })
      .addAttribute({ name: 'first-name' })
      .addAttribute({ name: 'last-name' });

    fracture.addEntity({ name: 'group' });

  }


}


