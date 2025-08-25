export const getPetsByParent = async (id: string) => {
  const response = await fetch(
    `/api/pet-parent/my-pets/${id ? id : "68a4597b6fbe5d3c548c215d"}`
  );
  const result = await response.json();

  console.log("result", result);

  return result;
};
