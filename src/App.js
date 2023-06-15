import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Typography, List, Pagination, Select } from "antd";

const { Search } = Input;
const { Title } = Typography;
const { Option } = Select;

const PostsApp = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const postsPerPage = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts"
        );
        setPosts(response.data);
        setFilteredPosts(response.data);
      } catch (error) {
        setError("Error retrieving posts. Please try again later.");
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterPosts(value);
  };

  const filterPosts = (searchTerm) => {
    if (!searchTerm) {
      setFilteredPosts(posts);
    } else if (posts && posts.length) {
      // Check if posts array exists and is not empty
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    sortPosts(value);
  };

  const sortPosts = (sortBy) => {
    let sortedPosts = [...filteredPosts];
    switch (sortBy) {
      case "date":
        sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "title":
        sortedPosts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    setFilteredPosts(sortedPosts);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={2} style={{ marginBottom: "1.2rem", color: "DodgerBlue" }}>
        Posts
      </Title>
      <Search
        placeholder="Search Post..."
        value={searchTerm}
        onChange={(event) => handleSearch(event.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Title level={4} style={{ marginBottom: "1.2rem", color: "DodgerBlue" }}>
        Filter
      </Title>
      <Select
        value={sortBy}
        onChange={handleSortChange}
        style={{ width: 120, marginBottom: 16 }}
        placeholder="Sort By"
      >
        <Option value="title">Title</Option>
      </Select>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <List
            dataSource={currentPosts}
            renderItem={(post) => (
              <List.Item >
                <List.Item.Meta title={post.title} description={post.body} />
              </List.Item>
            )}
          />
          <Pagination
            current={currentPage}
            pageSize={postsPerPage}
            total={filteredPosts.length}
            onChange={handlePageChange}
            showQuickJumper
            showTotal={(total) => `Total ${total} posts`}
            style={{ marginTop: 16, textAlign: "center" }}
          />
        </>
      )}
    </div>
  );
};

export default PostsApp;
