export const getPetsByParent = async () => {
  const response = await fetch("/api/pet-parent/68a4597b6fbe5d3c548c215d");
  const result = await response.json();

  console.log("result", result);

  return result;
};
