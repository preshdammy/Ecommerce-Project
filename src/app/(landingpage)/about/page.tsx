import Headers from "../components/header/index"
import Footer from "../components/footer/index"
const About = () => {
    return ( 
<div>
    <Headers/>

 <div className="min-h-screen bg-white px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">About us</h1>
        <p className="text-gray-700 leading-relaxed">
          At Time Shoppy, we pride ourselves in being reliable and efficient.
We are dedicated to having our customer satisfied as well as our
vendors paid. Fraudulent activities are not allowed on this platform.
Do not hesitate to report any suspicious activity. Once reported, we will investigate accordingly.
        </p>
      </div>
    </div>
    <Footer/>
</div>
     );
}
 
export default About;