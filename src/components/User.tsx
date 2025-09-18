import { useEffect, useState } from "preact/hooks";

function User() {
  const [userList, setUserList] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      setUserList(await res.json());

      console.log(userList);

      //   userList.forEach((element) => {
      //     console.log(element);
      //   });
    };

    fetchData();
  }, []);

  return (
    <ul>
      {userList === null
        ? ""
        : userList.map((user) => (
            <li>
              <div class="bg-info">
                {user.name} - {user.email}
              </div>
            </li>
          ))}
    </ul>
  );

  //   <ul>
  //     {userList.map((user) => (
  //       <li key={user.id}>{user.name}</li>
  //     ))}
  //   </ul>;
}

export default User;
