import React from "react";
import TinyMealItem from "./TinyMealItem";
import MultiSelectList from "./MultiSelectList";

const MultiSelectMealsList = ({
  meals,
  visibleMeals,
  onEndSelection,
  searchTerm,
}) => {
  const renderItem = (item) => {
    return <TinyMealItem meal={item} searchTerm={searchTerm} />;
  };

  return (
    <MultiSelectList
      data={meals}
      visibleData={visibleMeals}
      renderItem={renderItem}
      onEndSelection={onEndSelection}
    />
  );
};

export default MultiSelectMealsList;
