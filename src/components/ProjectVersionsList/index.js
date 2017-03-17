import BaseComponent from "../base-component";
import LinearProgress from "material-ui/LinearProgress";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default class ProjectVersionsList extends BaseComponent
{
    render()
    {
        return (
            <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>Project name</TableHeaderColumn>
                        <TableHeaderColumn>Version</TableHeaderColumn>
                        {
                            (this.props.extraColumns || []).map((column, index) =>
                            {
                                return <TableHeaderColumn key={index}>{column.heading}</TableHeaderColumn>;
                            })
                        }
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {
                        (() =>
                        {
                            if (this.props.isLoading)
                            {
                                return (
                                    <TableRow>
                                        <TableRowColumn>
                                            <LinearProgress mode="indeterminate" />
                                        </TableRowColumn>
                                    </TableRow>
                                );
                            }
                            else if (!this.props.projects || !this.props.projects.length)
                            {
                                return (
                                    <TableRow>
                                        <TableRowColumn>Nothing to show here.</TableRowColumn>
                                    </TableRow>
                                );
                            }

                            return this.props.projects.map((project, index) =>
                            {
                                return (
                                    <TableRow key={index}>
                                        <TableRowColumn>{project.name}</TableRowColumn>
                                        <TableRowColumn>{project.version}</TableRowColumn>
                                        {
                                            (() =>
                                            {
                                                if (this.props.extraColumns)
                                                {
                                                    return this.props.extraColumns.map((column, index) =>
                                                    {
                                                        let cellContent;

                                                        switch (column.type)
                                                        {
                                                            case "button":
                                                                cellContent = <button class="btn btn-default" onClick={column.action(project)}>{column.actionName}</button>;
                                                                break;
                                                            case "template":
                                                                cellContent = column.template(project);
                                                                break;
                                                            default:
                                                                cellContent = <span>{project[column.name]}</span>;
                                                                break;
                                                        }

                                                        return <TableRowColumn key={index}>{cellContent}</TableRowColumn>;
                                                    });
                                                }
                                            })()
                                        }
                                    </TableRow>
                                );
                            });
                        })()
                    }
                </TableBody>
            </Table>
        );
    }

    // render()
    // {
    //     return (
    //         <table className="table" style={this.props.style}>
    //             <thead>
    //             <tr>
    //                 <th>Project name</th>
    //                 <th>Version</th>
    //                 {
    //                     (() =>
    //                     {
    //                         if (this.props.extraColumns)
    //                         {
    //                             return this.props.extraColumns.map((column, index) =>
    //                             {
    //                                 return <th key={index}>{column.heading}</th>;
    //                             });
    //                         }
    //                     })()
    //                 }
    //             </tr>
    //             </thead>
    //             <tbody>
    //             {
    //                 (() =>
    //                 {
    //                     if (this.props.isLoading)
    //                     {
    //                         return (
    //                             <tr>
    //                                 <td colSpan={ 2 + ((this.props.extraColumns && this.props.extraColumns.length) || 0) }>
    //                                     <InfiniteLoading />
    //                                 </td>
    //                             </tr>
    //                         );
    //                     }
    //                     else if (!this.props.projects || !this.props.projects.length)
    //                     {
    //                         return (
    //                             <tr>
    //                                 <td colSpan={ 2 + ((this.props.extraColumns && this.props.extraColumns.length) || 0) }>Nothing to show here.</td>
    //                             </tr>
    //                         );
    //                     }
    //
    //                     return this.props.projects.map((project, index) =>
    //                     {
    //                         return (
    //                             <tr key={index}>
    //                                 <td>{project.name}</td>
    //                                 <td>{project.version}</td>
    //                                 {
    //                                     (() =>
    //                                     {
    //                                         if (this.props.extraColumns)
    //                                         {
    //                                             return this.props.extraColumns.map((column, index) =>
    //                                             {
    //                                                 let cellContent;
    //
    //                                                 switch (column.type)
    //                                                 {
    //                                                     case "button":
    //                                                         cellContent = <button class="btn btn-default" onClick={column.action(project)}>{column.actionName}</button>;
    //                                                         break;
    //                                                     case "template":
    //                                                         cellContent = column.template(project);
    //                                                         break;
    //                                                     default:
    //                                                         cellContent = <span>{project[column.name]}</span>;
    //                                                         break;
    //                                                 }
    //
    //                                                 return <td key={index}>{cellContent}</td>;
    //                                             });
    //                                         }
    //                                     })()
    //                                 }
    //                             </tr>
    //                         );
    //                     });
    //                 })()
    //             }
    //             </tbody>
    //         </table>
    //     );
    // }
}