export const getPetsByParent = async (id: string) => {
  const response = await fetch(`/api/pet-parent/my-pets/${id}`);
  const result = await response.json();

  console.log("result", result);

  return result;
};
