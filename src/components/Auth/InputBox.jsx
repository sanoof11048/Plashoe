
import { Field, ErrorMessage } from "formik";

const InputBox = ({ type, name, placeholder, icon }) => {
  return (
    <div className="input-box relative w-full mb-2 md:mb-5">
      <Field
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full p-2 pl-6 pr-12 bg-gray-200 rounded-lg text-lg outline-none"
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-[8px] mt-1 text-left"
      />
      <i
        className={`bx ${icon} absolute right-4 top-1/2 -translate-y-1/2 text-xl`}
      ></i>
    </div>
  );
};

export default InputBox;