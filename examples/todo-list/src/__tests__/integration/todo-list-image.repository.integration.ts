import {expect, toJSON} from '@loopback/testlab';
import {
  TodoListImageRepository,
  TodoListRepository,
  TodoRepository,
} from '../../repositories';
import {
  givenEmptyDatabase,
  givenTodoListImageInstance,
  givenTodoListInstance,
  testdb,
} from '../helpers';

describe('TodoListImageRepository', () => {
  let todoListImageRepo: TodoListImageRepository;
  let todoListRepo: TodoListRepository;
  let todoRepo: TodoRepository;

  before(async () => {
    todoListRepo = new TodoListRepository(
      testdb,
      async () => todoRepo,
      async () => todoListImageRepo,
    );
    todoListImageRepo = new TodoListImageRepository(
      testdb,
      async () => todoListRepo,
    );
  });

  beforeEach(givenEmptyDatabase);

  it('includes TodoList in find method result', async () => {
    const list = await givenTodoListInstance(todoListRepo);
    const image = await givenTodoListImageInstance(todoListImageRepo, {
      todoListId: list.id,
    });

    const response = await todoListImageRepo.find({
      include: [{relation: 'todoList'}],
    });

    expect(toJSON(response)).to.deepEqual([
      {
        ...toJSON(image),
        todoList: toJSON(list),
      },
    ]);
  });

  it('includes TodoList in findById result', async () => {
    const list = await givenTodoListInstance(todoListRepo, {});
    const image = await givenTodoListImageInstance(todoListImageRepo, {
      todoListId: list.id,
    });

    const response = await todoListImageRepo.findById(image.id, {
      include: [{relation: 'todoList'}],
    });

    expect(toJSON(response)).to.deepEqual({
      ...toJSON(image),
      todoList: toJSON(list),
    });
  });
});
