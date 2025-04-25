import React from "react";

const NotFoundPage = () => {
  return (
    <>
      <section className="page_404 min-h-screen min-w-screen ">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="four_zero_four_bg mx-auto w-1/2">
              <h1 className="text-center mt-2">404</h1>
            </div>

            <div className="contant_box_404 mt-[-50px]">
              <h3 className="text-2xl font-bold mb-2">Looks like you're lost</h3>
              <p className="mb-4">The page you are looking for is not available!</p>
              <a href="/" className="link_404">
                Go to Home
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>
        {`
          .page_404 {
            padding: 40px 0;
            background: #fff;
            font-family: 'Arvo', serif;
          }

          .four_zero_four_bg {
            background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif);
            height: 400px;
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
          }

          .four_zero_four_bg h1 {
            font-size: 80px;
          }

          .link_404 {
            color: #fff !important;
            padding: 10px 20px;
            background: #39ac31;
            margin: 20px 0;
            display: inline-block;
            text-decoration: none;
            border-radius: 5px;
          }
        `}
      </style>
    </>
  );
};

export default NotFoundPage;
