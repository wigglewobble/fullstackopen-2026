import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const Authors = ({ show }) => {
  const result = useQuery(ALL_AUTHORS);

  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const authors = result.data.allAuthors;

  useEffect(() => {
    if (authors.length > 0 && name === "") {
      setName(authors[0].name);
    }
  }, [authors, name]);

  const submit = async (event) => {
    event.preventDefault();

    await editAuthor({
      variables: {
        name,
        setBornTo: Number(born),
      },
    });

    setBorn("");
  };

  return (
    <div>
      <h2>authors</h2>

      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Born</th>
            <th>Books</th>
          </tr>

          {authors.map((author) => (
            <tr key={author.name}>
              <td>{author.name}</td>
              <td>{author.born}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Set birthyear</h3>

      <form onSubmit={submit}>
        <div>
          name
          <select
            value={name}
            onChange={({ target }) => setName(target.value)}
          >
            {authors.map((author) => (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>

        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;