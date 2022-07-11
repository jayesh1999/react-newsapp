import React, { Component } from 'react'
import NewsItem from "./NewsItem"
import Spinner from './Spinner';
import PropTypes from 'prop-types'

export default class News extends Component {
    static defaultProps ={
        country:"in",
        pageSize:8,
        category:"general"
    }
    static propTypes ={
        country:PropTypes.string,
        pageSize:PropTypes.number,
        category:PropTypes.string
    }
    capitalizeFirstLetter  = (string) =>{
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            loading: false,
            page: 1
        }
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`
    }

    async componentDidMount() {
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0b0a64feb5b24e0bb34c3bc3d43e83ac&page=1&pageSize=${this.props.pageSize}`
        let data = await fetch(url)
        let parseData = await data.json();
        console.log(parseData)
        this.setState({articles: parseData.articles, totalResults: parseData.totalResults})
    }

    myButtonNextClick = async () => {
        
        if(!(this.state.page +1 > Math.ceil(this.state.totalResults/`${this.props.pageSize}`))){

         let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0b0a64feb5b24e0bb34c3bc3d43e83ac&page=${this.state.page +1}&pageSize=${this.props.pageSize}`
         this.setState({loading:true})
         let data = await fetch(url)
         let parseData = await data.json();
         console.log(parseData)
         this.setState(
             {
                page: this.state.page +1,
                 articles :parseData.articles,
                 loading:false
            }
             
             )
        }
    }

    myButtonprevClick = async () => {
               
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0b0a64feb5b24e0bb34c3bc3d43e83ac&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`
        this.setState({loading:true})
        let data = await fetch(url)
        let parseData = await data.json();
        console.log(parseData)
        this.setState(
            {
               page: this.state.page -1,
               articles :parseData.articles,
               loading:false
           }
            
            )
    }

    render() {
        return (
            <div className="container my-3">
                <h2 className='text-center' style={{margin:"30px 0px"}} ><span>newsMonkey - Top {this.capitalizeFirstLetter(this.props.category)} Hadlines</span></h2>
               {this.state.loading && <Spinner />}
                {/* /     { this.state.articles.map((element)=>{console.log(element)})} */}
                <div className="row">
                    {
                        this.state.articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title.slice(0, 22) : " "} description={element.description ? element.description.slice(0, 88) : " "} imageUrl={element.urlToImage ? element.urlToImage : "https://www.cartoq.com/wp-content/uploads/2021/12/tata-scrapping-fb.jpg"} newsUrl={element.url} author={element.author} date={element.publishedAt} sourse={element.source.name}/>

                            </div>
                        })
                    }
                    <div className="d-flex justify-content-around" role="group" aria-label="Basic mixed styles example">
                        <button type="button" disabled={this.state.page<=1} className="btn btn-danger" onClick={this.myButtonprevClick}>Left</button>
                       
                        <button type="button" disabled = { this.state.page +1 > Math.ceil(this.state.totalResults/`${this.props.pageSize}`)} onClick={this.myButtonNextClick} className="btn btn-success">Right</button>
                    </div>
                </div>
            </div>
        )
    }
}
