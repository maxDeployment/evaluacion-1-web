import * as yup from 'yup';

export const createTodoSchema = yup.object({
  title: yup.string().required()
});

export const updateTodoSchema = yup.object({
  title: yup.string(),
  completed: yup.boolean()
});
