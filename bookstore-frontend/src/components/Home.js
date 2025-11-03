import React from "react";
import BookList from './BookList';

const Home = ()=>{
    return(
        <div>
            <h2>Chào mừng bạn đến với web bán sách online   </h2>
            <p>Bạn đã đăng nhập thành công</p>

           <BookList />
        </div>
    );
};
export default Home;