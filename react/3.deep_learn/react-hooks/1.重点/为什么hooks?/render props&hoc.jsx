// * 1.render props
import Cat from 'components/cat'
class DataProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = { target: 'Zac' };
    }

    render() {
        return (
            <div>
                {this.props.children(this.state)}
            </div>
        )
    }
}
<DataProvider>
    {data => (
        <Cat target={data.target} />
    )}
</DataProvider>

// * 2.高阶组件hoc
const withUser = WrappedComponent => {
    const user = sessionStorage.getItem("user");
    return props => <WrappedComponent user={user} {...props} />;
};

const UserPage = props => (
    <div class="user-container">
        <p>My name is {props.user}!</p>
    </div>
);

export default withUser(UserPage);