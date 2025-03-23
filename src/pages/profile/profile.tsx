import { ProfileUI } from '@ui-pages';
import {
  FC,
  SyntheticEvent,
  useEffect,
  useState,
  useCallback,
  useRef
} from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { selectUser, updateUserThunk } from '@slices';
import { TUser } from '@utils-types';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser) as TUser;
  const prevUserRef = useRef(user); // Храним предыдущее состояние пользователя

  // Локальное состояние формы
  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  // Обновляем состояние формы при изменении данных пользователя
  useEffect(() => {
    if (prevUserRef.current !== user) {
      setFormValue({
        name: user?.name || '',
        email: user?.email || '',
        password: ''
      });
      prevUserRef.current = user;
    }
  }, [user]);

  // Определение, изменена ли форма
  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  // Мемоизированный обработчик отправки формы
  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      dispatch(updateUserThunk(formValue));
      setFormValue((prev) => ({ ...prev, password: '' })); // Очищаем пароль после отправки
    },
    [dispatch, formValue]
  );

  // Мемоизированный обработчик отмены изменений
  const handleCancel = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    },
    [user]
  );

  // Обработчик изменения значений формы
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValue((prev) => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    },
    []
  );

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      handleInputChange={handleInputChange}
    />
  );
};
