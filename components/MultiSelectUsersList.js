import React from "react";
import TinyUserItem from "./TinyUserItem";
import MultiSelectList from "./MultiSelectList";

const MultiSelectUsersList = ({
  users,
  visibleUsers,
  onEndSelection,
  searchTerm,
}) => {
  const renderItem = (item) => {
    return <TinyUserItem user={item} searchTerm={searchTerm} />;
  };

  return (
    <MultiSelectList
      data={users}
      visibleData={visibleUsers}
      renderItem={renderItem}
      onEndSelection={onEndSelection}
    />
  );
};

export default MultiSelectUsersList;
