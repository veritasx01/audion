export function TestPage({ toggle }) {
  return (
    <>
      <h1>
        main view
        <br />
        pages get rendered inside here
      </h1>
      <button onClick={toggle}>toggle right</button>
    </>
  );
}
