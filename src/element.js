// 导入自己需要的组件
import {
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  Radio,
  RadioGroup,
  RadioButton,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  Popover,
  Tooltip,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Icon,
  Row,
  Col,
  Upload,
  Badge,
  Card,
  Carousel,
  CarouselItem,
  Link,
  Divider,
  Image,
  Backtop,
  PageHeader,
  MessageBox,
  Message,
  Notification,
  Avatar,
  Drawer,
  Popconfirm,
  Breadcrumb,
  BreadcrumbItem,
  Collapse,
  CollapseItem,
  Alert,
  Loading,
  Pagination,
  Progress
} from "element-ui";
const element = {
  install: function (Vue) {
    Vue.use(Dialog);
    Vue.use(Dropdown);
    Vue.use(DropdownMenu);
    Vue.use(DropdownItem);
    Vue.use(Menu);
    Vue.use(Submenu);
    Vue.use(MenuItem);
    Vue.use(MenuItemGroup);
    Vue.use(Input);
    Vue.use(Radio);
    Vue.use(RadioGroup);
    Vue.use(RadioButton);
    Vue.use(Switch);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(OptionGroup);
    Vue.use(Button);
    Vue.use(ButtonGroup);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(DatePicker);
    Vue.use(Popover);
    Vue.use(Tooltip);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Tabs);
    Vue.use(TabPane);
    Vue.use(Tag);
    Vue.use(Icon);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Upload);
    Vue.use(Badge);
    Vue.use(Card);
    Vue.use(Carousel);
    Vue.use(CarouselItem);
    Vue.use(Link);
    Vue.use(Divider);
    Vue.use(Image);
    Vue.use(Backtop);
    Vue.use(PageHeader);
    Vue.use(Avatar);
    Vue.use(Drawer);
    Vue.use(Popconfirm);
    Vue.use(Breadcrumb);
    Vue.use(BreadcrumbItem);
    Vue.use(Collapse);
    Vue.use(CollapseItem);
    Vue.use(Alert);
    Vue.use(Pagination);
    Vue.use(Progress);
    Vue.use(Loading.directive);

    Vue.prototype.$loading = Loading.service;

    Vue.prototype.$msgbox = MessageBox;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$prompt = MessageBox.prompt;
    Vue.prototype.$notify = Notification;
    Vue.prototype.$message = Message;
  },
};
export default element;
