import React, { Component } from "react";
import "./App.css";
import styled from "styled-components";
import initialData from "./initial-data";
import Row from "./components/Row";
import { DragDropContext } from "react-beautiful-dnd";
import InputRow from "./components/InputRow";

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #595f68;
`;

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 4em;
  background: white;
`;

const Centered = styled.div`
  margin: auto;
  margin-top: 10px;
  width: 70%;
  display: grid;
  text-align: center;
  align-items: stretch;
  max-width: 70%;
  background-color: black;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  min-height; 60vh;
`;

const BigContainer = styled.div`
  //display: table-row;
  display: grid;
  // grid-template-columns: [tierNameStart] 1fr [tierNameEnd tierBoxStart] 4fr [tierBoxEnd];
  // grid-template-rows: 20%;
  //grid-gap: 2px 2px;
  grid-auto-flow: row;
  border: 2px solid black;
  width: 100%;
  height: 100%;
  background-color: #595f68;
  //position: relative;
`;

const Space = styled.div`
  margin: auto;
  margin-top: 10px;
  height: 100px;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.inputHandler = this.inputHandler.bind(this);
    this.clearAllHandler = this.clearAllHandler.bind(this);
  }

  inputHandler(data) {
    const currTasks = this.state.totalTasks + 1; // update total tasks++

    // add to tasks
    const idNewTask = `task-${currTasks}`;
    console.log(idNewTask);
    const newTaskContent = {
      id: idNewTask,
      content: data
    };

    // add to null-row
    const row = this.state.rows["null-row"];
    var newTaskIds = Array.from(row.taskIds);
    newTaskIds.push(idNewTask);

    const newRow = {
      ...row,
      taskIds: newTaskIds
    };
    // finished adding to null row

    const newState = {
      ...this.state,
      totalTasks: currTasks,
      tasks: {
        ...this.state.tasks,
        [newTaskContent.id]: newTaskContent
      },
      rows: {
        ...this.state.rows,
        "null-row": newRow
      }
    };

    this.setState(newState);
    return;
  }

  state = initialData;

  onDragEnd = result => {
    // TODO
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const start = this.state.rows[source.droppableId];
    const finish = this.state.rows[destination.droppableId];
    if (start === finish) {
      const row = start;
      const newTaskIds = Array.from(row.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newRow = {
        ...row,
        taskIds: newTaskIds
      };
      const newState = {
        ...this.state,
        rows: {
          ...this.state.rows,
          [newRow.id]: newRow
        }
      };

      this.setState(newState);
      return;
    }

    //moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds
    };
    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    };
    const newState = {
      ...this.state,
      rows: {
        ...this.state.rows,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    };
    this.setState(newState);
    return;
  };

  clearAllHandler() {
    //clear all tasks in tasks
    // go through all rows and clear taskids arr
    // set total tasks to 0
    const newTotalTasks = 0;
    const sRow = this.state.rows["s-row"];
    const aRow = this.state.rows["a-row"];
    const bRow = this.state.rows["b-row"];
    const cRow = this.state.rows["c-row"];
    const dRow = this.state.rows["d-row"];
    const nullRow = this.state.rows["null-row"];
    const newSRow = {
      ...sRow,
      taskIds: []
    };
    const newARow = {
      ...aRow,
      taskIds: []
    };
    const newBRow = {
      ...bRow,
      taskIds: []
    };
    const newCRow = {
      ...cRow,
      taskIds: []
    };
    const newDRow = {
      ...dRow,
      taskIds: []
    };
    const newNullRow = {
      ...nullRow,
      taskIds: []
    };

    const newState = {
      ...this.state,
      totalTasks: newTotalTasks,
      tasks: {},
      rows: {
        ...this.state.rows,
        [newSRow.id]: newSRow,
        [newARow.id]: newARow,
        [newBRow.id]: newBRow,
        [newCRow.id]: newCRow,
        [newDRow.id]: newDRow,
        [newNullRow.id]: newNullRow
      }
    };
    console.log(newState);
    this.setState(newState);
    return;
  }
  render() {
    return (
      <div>
        <Wrapper>
          <Title>Rate, Create</Title>
        </Wrapper>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Centered>
            <BigContainer>
              {this.state.rowOrder.map(rowId => {
                const row = this.state.rows[rowId];
                const tasks = row.taskIds.map(
                  taskId => this.state.tasks[taskId]
                );
                return <Row key={row.id} row={row} tasks={tasks} />;
              })}
            </BigContainer>
          </Centered>

          <InputRow
            inputField={this.state.iconInput}
            row={this.state.rows["null-row"]}
            key="null-row"
            handlerFromParent={this.inputHandler}
            totalTasks={this.state.totalTasks}
            tasks={this.state.tasks}
            clearAllHandler={this.clearAllHandler}
          />
        </DragDropContext>
        <Space />
      </div>
    );
  }
}

export default App;

// const result = {
//   draggableId: 'task-1',
//   type: 'TYPE',
//   reason: 'DROP',
//   source: {
//     droppableId: 'column-1',
//     index: 0,
//   },
//   destination: {
//     droppableId: 'column-1',
//     index:1,
//   },
// };
// JSON.stringify(config)
