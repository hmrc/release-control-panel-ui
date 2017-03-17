import BaseComponent from "../../components/base-component";
import {projectsRepository} from "../../repositories/projects-repository";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default class ProjectsList extends BaseComponent
{
    constructor(props) {
        super(props);

        this.state = {
            projects: projectsRepository.getProjects()
        };
    }

    render()
    {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <h1>Choose the project</h1>
                        <Table>
                            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                <TableRow>
                                    <TableHeaderColumn>#</TableHeaderColumn>
                                    <TableHeaderColumn>Name</TableHeaderColumn>
                                    <TableHeaderColumn>&nbsp;</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
                                {
                                    this.state.projects.map(function (project)
                                    {
                                        return (
                                            <TableRow key={project.key}>
                                                <TableRowColumn>{project.key}</TableRowColumn>
                                                <TableRowColumn>{project.name}</TableRowColumn>
                                                <TableRowColumn>
                                                    <a href={`#/project/${project.name}`} className="btn btn-default">Select</a>
                                                </TableRowColumn>
                                            </TableRow>
                                        );
                                    })
                                }
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        );
    }
}