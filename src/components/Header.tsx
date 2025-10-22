import { isEmail } from '../utils/validation';

type TContact = {
  icon?: string;
  label: string;
  link: string;
}

type THeader = {
  name: string;
  contacts: TContact[],
}

const Header = ({ name, contacts = [] }: THeader) => (
  <div className="text-center mb-3">
    <h1 className="text-3xl font-bold">{name || "Your Name here"}</h1>
    {contacts.length > 0 && (
      <div className="flex justify-center space-x-4 text-sm text-gray-700">
        {
          contacts.map(({icon, label, link}) => (
            <span className="flex items-center space-x-1">
              {icon && icon}
              <a href={isEmail(link) ? `mailto:${link}` : link} className="text-gray-600 hover:underline">{label}</a>
            </span>
          )
          )
        }
      </div>
    )}
  </div>
);

export { Header };
export type { THeader, TContact };