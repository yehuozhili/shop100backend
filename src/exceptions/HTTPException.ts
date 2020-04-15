class HTTPException {
    constructor(public status:number,public data:string,public errors?:any){
        this.status=status
        this.data=data
        this.errors = errors||{}
    }
}
export default HTTPException
