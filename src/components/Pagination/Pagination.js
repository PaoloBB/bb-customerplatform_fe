import React, { Component } from 'react';
import { Pagination, Pager } from 'react-bootstrap';

const Paginator = ({ pages, handleChangePage, active }) => {
  const items = [];
  for (let number = 1; number <= pages; number++) {
    items.push(<Pagination.Item
      key={number}
      onClick={() => {
        handleChangePage(number);
      }}
      active={number === active}
    >
      {number}
    </Pagination.Item>);
  }

  return (
    <Pagination bsSize="small">
      {active > 1 &&
        pages > 1 && (
        <Pagination.Prev
          onClick={() => {
            handleChangePage(active - 1);
          }}
        />
      )}
      {items}
      {active < pages &&
        pages > 1 && (
        <Pagination.Next
          onClick={() => {
            handleChangePage(active + 1);
          }}
        />
      )}
    </Pagination>
  );
};

export default Paginator;
