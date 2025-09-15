export interface Reviews {
  _id: string;
  appointmentDate: string;
  createdAt: string;
  vetId: {
    name: string;
    _id: string;
  };
  doctorName: string;
  parentId: {
    name: string;
    _id: string;
  };
  parentName: string;
  rating: string;
  comment: string;
  visible: boolean;
}
