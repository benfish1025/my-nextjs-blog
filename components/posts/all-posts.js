import classes from './all-posts.module.css';
import PostsGrid from './posts-grid';

function AllPosts(props) {
  return (
      <section className={classes.posts}>
        <figure className={classes.saying}>
          <p>嗟尔君子，勿恒安息；敬恭而位，好是正直。</p>
          <p className={classes.writer}>——《荀子》</p>
        </figure>
        <PostsGrid posts={props.posts}/>
      </section>
  );
}

export default AllPosts;
