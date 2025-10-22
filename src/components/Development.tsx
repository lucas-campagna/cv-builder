export type TDevelopment = {
  onChangeContent: (content: string) => void;
  onChangeStyle: (style: string) => void;
}
const Development = ({
  onChangeContent,
  onChangeStyle,
}) => {
  return (
    <div className="dev z-index-10 w-screen h-screen fixed pointer-events-none">

    </div>
  );
};
export default Development;
