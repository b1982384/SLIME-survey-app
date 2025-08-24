import { Fragment } from "react";

function ListGroup() {
  return (
    <Fragment>
        <h1>List Example Test</h1>
        <ul className="list group:">
          <li className="list-group'item">Question one</li>
          <li className="list-group'item">Question two</li>
          <li className="list-group'item">Question three</li>
          <li className="list-group'item">Question four</li>
          <li className="list-group'item">etc</li>
        </ul>
    </Fragment>
  );
}

export default ListGroup;
